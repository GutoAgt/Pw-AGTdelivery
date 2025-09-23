import multer from "multer";
import serviceUsuario from "../services/service.usuario.js";

// Configuração multer: em memória
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // limite 5MB
  fileFilter: (req, file, cb) => {
    // aceita apenas imagens
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas arquivos de imagem são permitidos"));
    }
    cb(null, true);
  },
});

async function Favoritos(req, res) {
    try {
        const id_usuario = req.id_usuario;
        const favoritos = await serviceUsuario.Favoritos(id_usuario);

        res.status(200).json(favoritos);
    } catch (error) {
        res.status(500).json({ error });
    }
}

async function Login(req, res) {

    const { email, senha } = req.body;

    const usuario = await serviceUsuario.Login(email, senha);

    if (usuario.length == 0)
        res.status(401).json({ error: "E-mail ou senha inválida" });
    else
        res.status(200).json(usuario);
}

async function Inserir(req, res) {

    try {
        const { nome, email, senha, endereco, complemento, bairro, cidade, uf, cep } = req.body;

        const usuario = await serviceUsuario.Inserir(nome, email, senha, endereco,
            complemento, bairro, cidade, uf, cep);

        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ error });
    }
}

async function UpdateUserController(req, res) {
    try {
    const id = req.id_usuario; // id do token
    const dados = req.body || {}; // garante que seja objeto
    const arquivoFoto = req.file || null;

    const usuarioAtualizado = await serviceUsuario.UpdateUser(id, dados, arquivoFoto);

    return res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro UpdateUserController:", error);
    return res.status(400).json({ error: error.message });
  }
}


async function Perfil(req, res) {
    try {
        const id_usuario = req.id_usuario;
        const usuario = await serviceUsuario.Perfil(id_usuario);

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export default { Favoritos, Login, Inserir, UpdateUserController, Perfil };