import { Router } from "express";
import controllerCategoria from "./controllers/controller.categoria.js";
import controllerBanner from "./controllers/controller.banner.js";
import controllerEmpresa from "./controllers/controller.empresa.js";
import controllerPedido from "./controllers/controller.pedido.js";
import controllerUsuario from "./controllers/controller.usuario.js";
import { CriarPagamento, ConsultarStatus, WebhookPagamento } from "./controllers/controller.pagamento.js";
import { getStatus, updateStatus } from "./controllers/controller.empresas.js";
import jwt from "./token.js";

const router = Router();

router.get("/categorias", jwt.ValidateJWT, controllerCategoria.Listar);
router.get("/banners", jwt.ValidateJWT, controllerBanner.Listar);
router.post("/pagamentos", jwt.ValidateJWT, CriarPagamento)
// Consultar status do pagamento
router.get("/pagamentos/:payment_token/status", jwt.ValidateJWT, ConsultarStatus);
// Webhook da Efi (atualiza automaticamente status do pagamento)
router.post("/pagamentos/webhook", WebhookPagamento); // sem JWT
// rota para criar subconta EFI
router.post("/:id_empresa/subconta-efi", controllerEmpresa.CriarSubcontaEfi)

// Empresas
router.get("/empresas/destaques", jwt.ValidateJWT, controllerEmpresa.Destaques);
router.get("/empresas", jwt.ValidateJWT, controllerEmpresa.Listar);
router.post("/empresas/:id_empresa/favoritos", jwt.ValidateJWT, controllerEmpresa.InserirFavorito);
router.delete("/empresas/:id_empresa/favoritos", jwt.ValidateJWT, controllerEmpresa.ExcluirFavorito);
router.get("/empresas/:id_empresa/cardapio", jwt.ValidateJWT, controllerEmpresa.Cardapio);
router.get("/empresas/:id_empresa/produtos/:id_produto", jwt.ValidateJWT, controllerEmpresa.ListarProdutoId);
router.get("/empresas/:id_empresa/status", jwt.ValidateJWT, getStatus);
router.put("/empresas/:id_empresa/status", jwt.ValidateJWT, updateStatus);


// Pedidos
router.get("/pedidos", jwt.ValidateJWT, controllerPedido.Listar);
router.get("/pedidos/:id_pedido", jwt.ValidateJWT, controllerPedido.ListarId);
router.post("/pedidos", jwt.ValidateJWT, controllerPedido.Inserir);


// Usuarios
router.get("/usuarios/favoritos", jwt.ValidateJWT, controllerUsuario.Favoritos);
router.post("/usuarios/login", controllerUsuario.Login);
router.post("/usuarios", controllerUsuario.Inserir);
router.get("/usuarios/perfil", jwt.ValidateJWT, controllerUsuario.Perfil);
router.patch("/perfil", jwt.ValidateJWT, controllerUsuario.UpdatePerfil);

export default router;