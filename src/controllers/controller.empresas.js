import db from "../models/index.js";
const Empresa = db.empresas;

// ✅ Retorna o status atual da empresa
export const getStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await Empresa.findByPk(id, {
      attributes: ["id_empresa", "nome", "status_funcionamento"],
    });

    if (!empresa) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    res.json({
      id_empresa: empresa.id_empresa,
      nome: empresa.nome,
      status_funcionamento: empresa.status_funcionamento,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar status da empresa" });
  }
};

// ✅ Atualiza manualmente o status (Aberto / Fechado)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_funcionamento } = req.body;

    if (!["Aberto", "Fechado"].includes(status_funcionamento)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    empresa.status_funcionamento = status_funcionamento;
    await empresa.save();

    res.json({
      message: "Status atualizado com sucesso",
      id_empresa: empresa.id_empresa,
      status_funcionamento: empresa.status_funcionamento,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar status da empresa" });
  }
};

// ✅ Atualiza automaticamente o status de todas as empresas com base no horário
export const updateStatusAutomatico = async () => {
  try {
    const empresas = await Empresa.findAll({
      attributes: ["id_empresa", "nome", "hora_abertura", "hora_fechamento", "status_funcionamento"],
    });

    const agora = new Date();
    const horaAtual = agora.getHours() + agora.getMinutes() / 60;

    for (const emp of empresas) {
      const [hAbertura, mAbertura] = emp.hora_abertura.split(":").map(Number);
      const [hFechamento, mFechamento] = emp.hora_fechamento.split(":").map(Number);

      const horaIni = hAbertura + mAbertura / 60;
      const horaFim = hFechamento + mFechamento / 60;

      const statusDesejado =
        horaAtual >= horaIni && horaAtual < horaFim ? "Aberto" : "Fechado";

      if (emp.status_funcionamento !== statusDesejado) {
        console.log(`🔄 Atualizando ${emp.nome}: ${emp.status_funcionamento} → ${statusDesejado}`);
        emp.status_funcionamento = statusDesejado;
        await emp.save();
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar status automático:", error);
  }
};
