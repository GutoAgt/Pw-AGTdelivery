import multer from "multer";
import serviceUsuario from "../services/service.usuario.js";

const upload = multer(); // em memória, pega buffer do arquivo

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

async function UpdateUser(req, res) {
    try {
    const id = req.id_usuario; // ID do token
        const dados = req.body;    // Campos enviados

        // Arquivo de foto (se enviado via FormData)
        const arquivoFoto = req.file; 

        // Chama o serviço passando dados + arquivo
        const usuarioAtualizado = await serviceUsuario.UpdateUser(id, dados, arquivoFoto);

        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
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

export default { Favoritos, Login, Inserir, UpdateUser, Perfil };