import { execute } from "../database/sqlite.js";

async function Favoritos(id_usuario) {

    const sql = `select f.*, e.icone, e.nome, e.endereco, e.complemento, e.bairro, e.cidade, e.uf
    from usuario_favorito f
    join empresa e on (e.id_empresa = f.id_empresa)
    where f.id_usuario = ?`;

    const favoritos = await execute(sql, [id_usuario]);

    return favoritos;
}

async function Inserir(nome, email, senha, endereco, complemento, bairro, cidade, uf, cep) {

    const sql = `insert into usuario(nome, email, senha, 
            endereco, complemento, bairro, cidade, uf, cep, dt_cadastro) 
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) returning id_usuario`;

    let usuario = await execute(sql, [nome, email, senha, endereco, complemento,
        bairro, cidade, uf, cep]);

    return usuario[0];
}

async function ListarByEmail(email) {

    const sql = `select id_usuario, senha, nome, email, endereco, complemento,
    bairro, cidade, uf, cep, dt_cadastro
    from usuario    
    where email = ?`;

    const usuario = await execute(sql, [email]);

    if (usuario.length == 0)
        return [];
    else
        return usuario[0];
}

async function UpdateUser(id_usuario, dados) {
    // Se não mandou nada, não atualiza
  if (!dados || Object.keys(dados).length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  // Monta dinamicamente os SETs do UPDATE
  const campos = Object.keys(dados);
  const valores = Object.values(dados);

  const setClause = campos.map(campo => `${campo} = ?`).join(", ");

  const sql = `UPDATE usuario SET ${setClause} WHERE id_usuario = ?`;

  await execute(sql, [...valores, id_usuario]);

  return true;
}


async function ListarById(id_usuario) {

    const sql = `select id_usuario, nome, email, endereco, complemento,
    bairro, cidade, uf, cep, dt_cadastro
    from usuario    
    where id_usuario = ?`;

    const usuario = await execute(sql, [id_usuario]);

    if (usuario.length == 0)
        return [];
    else
        return usuario[0];
}

export default { Favoritos, Inserir, UpdateUser, ListarByEmail, ListarById };