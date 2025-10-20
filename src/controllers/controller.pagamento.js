import EfiPay from "efipay";
import db from "../database/sqlite";

// Criar pagamento
export const CriarPagamento = async (req, res) => {
  try {
    const { id_pedido, total, tipo, card_token, id_empresa } = req.body;

    if (!id_pedido || !total || !tipo || !id_empresa) {
      return res.status(400).json({ error: "Dados insuficientes." });
    }

    // 🔹 Busca a empresa e suas credenciais
    const empresa = await db.get(
      `SELECT * FROM EMPRESA WHERE id_empresa = ?`,
      [id_empresa]
    );

    if (!empresa?.efi_client_id || !empresa?.efi_client_secret) {
      return res.status(400).json({
        error: "Empresa ainda não possui conta EFI configurada.",
      });
    }

    // Configura SDK da empresa (subconta)
    const options = {
      client_id: empresa.efi_client_id,
      client_secret: empresa.efi_client_secret,
      sandbox: true,
      certificate: `./certs/${empresa.efi_account_id}.pem`,
    };

    const efi = new EfiPay(options);
    let dados = {};
    let status_pagamento = "pendente";

    // ======================================================
    // 💰 PAGAMENTO PIX
    // ======================================================
    if (tipo === "PIX") {
      const body = {
        calendario: { expiracao: 3600 },
        valor: { original: total.toFixed(2) },
        chave: empresa.efi_chave_pix,
        solicitacaoPagador: `Pagamento do pedido #${id_pedido}`,
      };

      const charge = await efi.pixCreateImmediateCharge([], body);
      const qrcode = await efi.pixGenerateQRCode({ id: charge.loc.id });

      dados = { tipo: "PIX", data: qrcode };
      status_pagamento = "aguardando_pagamento";
    }

    // ======================================================
    // 💳 PAGAMENTO CARTÃO
    // ======================================================
    if (tipo === "CARTAO") {
      if (!card_token) {
        return res.status(400).json({ error: "Token do cartão ausente." });
      }

      const body = {
        payment: {
          credit_card: {
            payment_token: card_token,
            billing_address: {
              street: "Rua Exemplo",
              number: 123,
              neighborhood: "Centro",
              zipcode: "01001000",
              city: "São Paulo",
              state: "SP",
            },
            customer: {
              name: "Cliente App",
              email: "cliente@app.com",
              cpf: "12345678909",
              birth: "1990-01-01",
              phone_number: "11999999999",
            },
          },
        },
        items: [
          {
            name: `Pedido #${id_pedido}`,
            value: Math.round(total * 100),
            amount: 1,
          },
        ],
      };

      const charge = await efi.createCardCharge([], body);
      dados = { tipo: "CARTAO", data: charge };
      status_pagamento = "processando";
    }

    // ======================================================
    // 🧾 Atualiza status_pagamento do pedido
    // ======================================================
    await db.run(
      `UPDATE PEDIDOS SET status_pagamento = ? WHERE id_pedido = ?`,
      [status_pagamento, id_pedido]
    );

    return res.json({
      success: true,
      mensagem: "Pagamento criado com sucesso!",
      dados,
      status_pagamento,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: error.message });
  }
};
