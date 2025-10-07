import repositoryUsuario from "../repositories/repository.usuario.js";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "../token.js";
import { fileURLToPath } from "url";

// Corrige __dirname em ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function UpdateUser(id_usuario, dados = {}, arquivoFoto = null) {
   if (!id_usuario) throw new Error("ID do usuário não fornecido");
  if (!dados || typeof dados !== "object") throw new Error("Dados inválidos");

  // Verifica se usuário existe
  const usuario = await repositoryUsuario.ListarById(id_usuario);
  if (!usuario) throw new Error("Usuário não encontrado");

  // Campos permitidos
  const camposPermitidos = [
    "nome",
    "email",
    "endereco",
    "complemento",
    "bairro",
    "cidade",
    "uf",
    "cep",
  ];

  const campos = Object.keys(dados)
    .filter((c) => camposPermitidos.includes(c));

  // Se tiver arquivo de foto
  if (arquivoFoto) {
    // Como está usando multer.diskStorage, já temos o arquivo salvo em `arquivoFoto.path`
    const nomeArquivo = `user_${id_usuario}${path.extname(arquivoFoto.originalname)}`;
    const destino = path.join(__dirname, "..", "uploads", nomeArquivo);
    //Renomeie o arquivo para ter consistencia
    await fs.rename(arquivoFoto.path, destino);
    //Adiciona a coluna "foto"
    dados.foto = `/uploads/${nomeArquivo}`;
    campos.push("foto");
  }

  // Atualiza apenas os campos permitidos
  const dadosAtualizar = {};
  campos.forEach((campo) => {
    dadosAtualizar[campo] = dados[campo];
  });

  if (Object.keys(dadosAtualizar).length === 0) {
    throw new Error("Nenhum dado válido para atualizar");
  }

  const usuarioAtualizado = await repositoryUsuario.Update(id_usuario, dadosAtualizar);
  return usuarioAtualizado;
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