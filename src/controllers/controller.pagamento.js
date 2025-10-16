import { EfiPay } from "efi-sdk"; // sua SDK já instalada
import db from "../database.js";   // Sequelize ou outro ORM
import { Pedido } from "../models/pedido.js"; // tabela de pedidos

// Criar pagamento
export const CriarPagamento = async (req, res) => {
  try {
    const { id_pedido, total, tipo, card_token } = req.body;

    if (!id_pedido || !total || !tipo)
      return res.status(400).json({ error: "Parâmetros inválidos" });

    let pagamento;

    if (tipo === "PIX") {
      pagamento = await EfiPay.createPixCharge({
        orderId: id_pedido,
        amount: total,
        description: `Pedido #${id_pedido}`,
      });
    } else if (tipo === "CARTAO") {
      if (!card_token)
        return res.status(400).json({ error: "Token do cartão é obrigatório" });

      pagamento = await EfiPay.createCardCharge({
        orderId: id_pedido,
        amount: total,
        description: `Pedido #${id_pedido}`,
        card_token,
      });
    } else {
      return res.status(400).json({ error: "Tipo de pagamento inválido" });
    }

    // Atualiza o pedido com payment_token
    await Pedido.update(
      { payment_token: pagamento.payment_token, status_pedido: "PENDENTE" },
      { where: { id_pedido } }
    );

    return res.json({ pagamento });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Falha ao processar pagamento" });
  }
};

// Consultar status
export const ConsultarStatus = async (req, res) => {
  try {
    const { payment_token } = req.params;
    const status = await EfiPay.getPaymentStatus(payment_token);

    // Atualiza pedido no banco conforme status
    if (status === "APROVADO") {
      await Pedido.update({ status_pedido: "APROVADO" }, { where: { payment_token } });
    }

    return res.json({ status });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Falha ao consultar status" });
  }
};

// Webhook para atualização automática
export const WebhookPagamento = async (req, res) => {
  try {
    const { payment_token, status } = req.body;

    // Atualiza status do pedido
    await Pedido.update({ status_pedido: status }, { where: { payment_token } });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Erro webhook pagamento:", error.message);
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
};
