import serviceUsuario from "../services/service.usuario.js";

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

async function UpdatePerfil(req, res) {
  try {
    const id = req.id_usuario; // vem do middleware JWT
    const {
      endereco,
      complemento,
      bairro,
      cidade,
      uf,
      cep
    } = req.body;

    // 🔍 Validações básicas
    if (!cep || cep.length < 8) {
      return res.status(400).send({ error: "CEP inválido." });
    }

    if (!endereco || !bairro || !cidade || !uf) {
      return res.status(400).send({ error: "Dados de endereço incompletos." });
    }

    // 🔹 Atualiza o endereço no banco
    const atualizado = await repositoryUsuario.AtualizarEndereco(
      id,
      endereco,
      complemento,
      bairro,
      cidade,
      uf,
      cep
    );

    return res.send({
      success: true,
      message: "Endereço atualizado com sucesso.",
      data: atualizado
    });

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).send({ error: "Erro interno ao atualizar o endereço." });
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

export default { Favoritos, Login, Inserir, UpdatePerfil, Perfil };