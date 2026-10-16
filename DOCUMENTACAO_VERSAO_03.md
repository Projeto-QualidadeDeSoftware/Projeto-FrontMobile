# Documentação da versão 0.3

## Objetivo da atualização

Adequar o Prontê Mobile aos contratos atuais da API Spring Boot recebida pela equipe.

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
- Tela para perguntas ao assistente de estoque;
- Exibição das mensagens devolvidas pela API em erros de validação e estoque;
- Login obrigatório antes do acesso ao sistema;
- Remoção dos dados locais de demonstração;
- Ícones na navegação, nos resumos e nos produtos;
- Remoção de textos de versão e informações técnicas da interface.

## Organização da integração

O arquivo `services/api.ts` reúne as chamadas HTTP. Ele possui funções para autenticação e para os endpoints de clientes, funcionários, produtos, vendas e assistente. As telas chamam as funções do componente principal e não precisam montar URLs ou cabeçalhos.

## Funcionamento da conexão

No navegador, o aplicativo utiliza `http://localhost:8080` como endereço padrão da API. Em celulares e emuladores, a variável `EXPO_PUBLIC_API_URL` permite informar o endereço correto do computador. Nenhuma tela interna é exibida antes de um login válido.

## Próximas etapas

- Permitir alterar e cancelar vendas pela interface;
- Guardar o token com segurança entre as sessões;
- Adicionar testes automatizados para os serviços e componentes.
