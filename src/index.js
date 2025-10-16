import express from "express";
import cors from "cors";
import router from "./routes.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { updateStatusAutomatico } from "./controllers/controller.empresas.js";
import pagamentoRoutes from "./routes/pagamentoRoutes.js";
import empresasRoutes from "./routes/empresas.routes.js";

dotenv.config()
const app = express();

// Middlewares...
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(router);

app.use("/pagamento", pagamentoRoutes);
app.use("/empresas", empresasRoutes);

app.listen(3001, () => {
    console.log("Servidor rodando na porta: 3001");
});
// 🕒 Agendamento automático a cada 5 minutos
cron.schedule("*/5 * * * *", () => {
  console.log("⏰ Executando verificação automática de status...");
  updateStatusAutomatico();
});