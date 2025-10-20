import repositoryEmpresa from "../repositories/repository.empresa.js";

async function Destaques(id_usuario) {

    const empresas = await repositoryEmpresa.Destaques(id_usuario);

    return empresas;
}

async function Listar(id_usuario, busca, id_categoria, id_banner) {

    const empresas = await repositoryEmpresa.Listar(id_usuario, busca, id_categoria, id_banner);

    return empresas;
}

async function InserirFavorito(id_usuario, id_empresa) {

    const empresas = await repositoryEmpresa.InserirFavorito(id_usuario, id_empresa);

    return empresas;
}

async function ExcluirFavorito(id_usuario, id_empresa) {

    const empresas = await repositoryEmpresa.ExcluirFavorito(id_usuario, id_empresa);

    return empresas;
}

async function Cardapio(id_usuario, id_empresa) {

    const card = await repositoryEmpresa.Cardapio(id_usuario, id_empresa);

    return card;
}

async function ListarProdutoId(id_empresa, id_produto) {

    const produto = await repositoryEmpresa.ListarProdutoId(id_empresa, id_produto);

    return produto;
}

async function CriarSubcontaEfi({ id_empresa, nome, email, cpf_cnpj, chave_pix }) {
  if (!id_empresa || !nome || !email || !cpf_cnpj || !chave_pix) {
    throw new Error("Dados incompletos para criar subconta EFI.");
  }

  const efi = new EfiPay(options);

  // Cria subconta (empresa)
  const subconta = await efi.createAccount([], {
    type: "payment_account",
    name: nome,
    email: email,
    cpf_cnpj: cpf_cnpj,
  });

  // Cria credenciais específicas da subconta
  const credentials = await efi.createAccountCredentials([], {
    account_id: subconta.data.id,
  });

  // Atualiza banco via repository
  await repositoryEmpresa.SalvarCredenciaisEfi({
    id_empresa,
    efi_account_id: subconta.data.id,
    efi_client_id: credentials.data.client_id,
    efi_client_secret: credentials.data.client_secret,
    efi_chave_pix: chave_pix,
  });

  return {
    success: true,
    mensagem: "Subconta EFI criada com sucesso!",
    dados: {
      id_account: subconta.data.id,
      client_id: credentials.data.client_id,
    },
  };
}

export default { Destaques, Listar, InserirFavorito, ExcluirFavorito, Cardapio, ListarProdutoId, CriarSubcontaEfi };