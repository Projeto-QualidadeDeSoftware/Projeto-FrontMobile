# Documentação da versão 0.6

## Objetivo da atualização

Conectar o Prontê Mobile à API publicada na infraestrutura do projeto, preservando a possibilidade de usar homologação ou uma API local durante o desenvolvimento.

## Ambientes disponíveis

- Produção: `https://api.20-151-6-104.sslip.io`;
- Homologação: `https://hml.20-151-6-104.sslip.io`;
- Desenvolvimento local: `http://localhost:8080`.

Sem um arquivo `.env`, o aplicativo utiliza automaticamente a API de produção. A variável `EXPO_PUBLIC_API_URL` substitui esse endereço quando for necessário usar outro ambiente.

## Mudanças identificadas na API

- Todas as rotas do sistema exigem token JWT, exceto o login;
- O login utiliza CPF e senha;
- A venda recebe cliente, funcionário e itens no corpo JSON;
- Cada item da venda possui produto e quantidade;
- A API calcula o total e realiza a baixa do estoque;
- A resposta da venda devolve cliente, funcionário e itens completos;
- Existe um assistente de estoque no endpoint `/assistente/pergunta`;
- Os erros possuem status, mensagem e data.

## Funcionalidades adaptadas no aplicativo

- Tela de login integrada ao endpoint `/auth/login`;
- Envio automático do token no cabeçalho `Authorization`;
- Encerramento da sessão quando a API responde `401`;
- Carregamento de clientes, funcionários, produtos e vendas após o login;
- Controle de quantidade de cada produto na frente de caixa;
- Envio da venda no novo formato esperado pela API;
- Atualização visual do estoque depois de uma venda;
- Exibição do novo formato do histórico de vendas;
- Cadastro, edição e exclusão de produtos;
- Cadastro, edição e exclusão de clientes;
- Cadastro, edição e exclusão de funcionários;
- Acesso aos cadastros pela área “Mais”;
- Placeholders com cor própria e contraste de texto auxiliar;
- Seletores de cliente e funcionário com pesquisa por nome, CPF ou cargo;
- Limite visual de resultados para listas grandes;
- Máscaras automáticas de CPF e telefone durante a digitação;
- Tratamento seguro de salário não informado;
- Ícones de produto definidos automaticamente pelo nome e pela descrição;
- Lista das palavras reconhecidas exibida no formulário de produto;
- Integração compatível com a API original, sem campo adicional de ícone;
- Tela para perguntas ao assistente de estoque;
- Exibição das mensagens devolvidas pela API em erros de validação e estoque;
- Login obrigatório antes do acesso ao sistema;
- Remoção dos dados locais de demonstração;
- Ícones na navegação, nos resumos e nos produtos;
- Remoção de textos de versão e informações técnicas da interface.

## Organização da integração

O arquivo `services/api.ts` reúne as chamadas HTTP. Ele possui funções para autenticação e para os endpoints de clientes, funcionários, produtos, vendas e assistente. As telas chamam as funções do componente principal e não precisam montar URLs ou cabeçalhos.

## Funcionamento da conexão

O aplicativo utiliza por padrão `https://api.20-151-6-104.sslip.io`. A variável `EXPO_PUBLIC_API_URL` permite escolher homologação ou uma API local sem modificar o código. Nenhuma tela interna é exibida antes de um login válido.

O servidor pode ser desligado pela equipe quando não estiver em uso. Nesse caso, o login exibirá uma mensagem de indisponibilidade até a API ser ligada novamente.

## Próximas etapas

- Permitir alterar e cancelar vendas pela interface;
- Guardar o token com segurança entre as sessões;
- Adicionar testes automatizados para os serviços e componentes.
