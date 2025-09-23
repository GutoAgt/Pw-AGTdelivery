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
    // Lista de colunas válidas (proteção extra)
    const camposPermitidos = [
        "nome", "email", "endereco", "complemento", 
        "bairro", "cidade", "uf", "cep", "foto"
    ];

    // Filtra apenas os campos válidos que vieram no PATCH
    const campos = Object.keys(dados).filter(campo => camposPermitidos.includes(campo));

    if (campos.length === 0) {
        throw new Error("Nenhum campo válido enviado para atualização");
    }

    // Monta os pares "campo = ?" dinamicamente
    const setClause = campos.map(campo => `${campo} = ?`).join(", ");

    // Valores correspondentes
    const valores = campos.map(campo => dados[campo]);

    // Adiciona o id para o WHERE
    valores.push(id_usuario);

    // Query final
    const sql = `UPDATE usuario SET ${setClause} WHERE id_usuario = ?`;

    console.log("SQL:", sql);
    console.log("Valores:", valores);

    try {
        await execute(sql, valores);
        return { id_usuario, ...dados };
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        throw new Error("Falha ao atualizar usuário no banco de dados");
    }
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