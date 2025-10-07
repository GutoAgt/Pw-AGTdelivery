import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import serviceUsuario from "./service.usuario.js";

const router = express.Router();

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // Nome temporário, será renomeado pelo UpdateUser
    cb(null, `temp_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Apenas imagens são permitidas"));
};

const upload = multer({ storage, fileFilter });

// Endpoint PATCH /usuarios/perfil
router.patch("/perfil", upload.single("foto"), async (req, res) => {
  try {
    const id_usuario = req.id_usuario; // obtido do middleware JWT
    const dados = req.body || {};                  // campos do formulário
    const arquivoFoto = req.file || null;    // arquivo enviado

    const usuarioAtualizado = await serviceUsuario.UpdateUser(id_usuario, dados, arquivoFoto);
    res.json(usuarioAtualizado);

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
