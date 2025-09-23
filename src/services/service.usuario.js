import repositoryUsuario from "../repositories/repository.usuario.js";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "../token.js";

async function Favoritos(id_usuario) {

    const favoritos = await repositoryUsuario.Favoritos(id_usuario);

    return favoritos;
}

async function Inserir(nome, email, senha, endereco, complemento, bairro, cidade, uf, cep) {

    const validarUsuario = await repositoryUsuario.ListarByEmail(email);

    if (validarUsuario.id_usuario)
        throw "Já existe uma conta criada com esse e-mail";

    const hashSenha = await bcrypt.hash(senha, 10);

    const usuario = await repositoryUsuario.Inserir(nome, email, hashSenha, endereco, complemento,
        bairro, cidade, uf, cep);

    usuario.token = jwt.CreateJWT(usuario.id_usuario);
    usuario.nome = nome;
    usuario.email = email;
    usuario.endereco = endereco;
    usuario.complemento = complemento;
    usuario.bairro = bairro;
    usuario.cidade = cidade;
    usuario.uf = uf;
    usuario.cep = cep;

    return usuario;
}

async function UpdateUser(id_usuario, dados, arquivoFoto) {
    // Verifica se usuário existe
    const usuario = await repositoryUsuario.ListarById(id_usuario);
    if (!usuario) throw new Error("Usuário não encontrado");

    // Campos permitidos
    const camposPermitidos = ["nome","email","endereco","complemento","bairro","cidade","uf","cep"];
    const campos = Object.keys(dados || {}).filter(c => camposPermitidos.includes(c));

    // Se tiver arquivo de foto, processa
    if (arquivoFoto) {
        // Exemplo simples: salva a foto localmente
        const extensao = path.extname(arquivoFoto.originalname);
        const nomeArquivo = `user_${id_usuario}${extensao}`;
        const caminhoDestino = path.join(__dirname, "..", "uploads", nomeArquivo);

        await fs.writeFile(caminhoDestino, arquivoFoto.buffer);

        // Salva a URL relativa no banco
        campos.push("foto");
        dados.foto = `/uploads/${nomeArquivo}`;
    }

    if (campos.length === 0) throw new Error("Nenhum campo válido para atualização");

    try {
        await repositoryUsuario.UpdateUser(id_usuario, dados);
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        throw new Error("Falha ao atualizar usuário");
    }

    // Retorna dados atualizados do banco
    const atualizado = await repositoryUsuario.ListarById(id_usuario);
    return atualizado;
}

async function Login(email, senha) {

    const usuario = await repositoryUsuario.ListarByEmail(email);

    if (usuario.length == 0)
        return [];
    else {
        if (await bcrypt.compare(senha, usuario.senha)) {
            delete usuario.senha;
            usuario.token = jwt.CreateJWT(usuario.id_usuario);

            return usuario;
        }
        else
            return [];
    }
}

async function Perfil(id_usuario) {

    const usuario = await repositoryUsuario.ListarById(id_usuario);

    return usuario;
}

export default { Favoritos, Inserir, UpdateUser, Login, Perfil };