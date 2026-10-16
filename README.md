# Prontê Mobile - versão 0.5

Aplicativo mobile do sistema Prontê, desenvolvido com React Native, Expo e TypeScript. Esta versão foi atualizada para os endpoints da API Spring Boot recebida pela equipe.

## O que já funciona

- Login por CPF e senha;
- Autenticação das requisições com token JWT;
- Consulta de produtos, clientes, funcionários e vendas;
- Venda com quantidade por produto;
- Cálculo do total e baixa de estoque pela API;
- Histórico com cliente, vendedor e itens da venda;
- Cadastro, edição e exclusão de produtos;
- Cadastro, edição e exclusão de clientes;
- Cadastro, edição e exclusão de funcionários;
- Assistente de IA para perguntas sobre o estoque;
- Mensagens de validação e erro devolvidas pela API;
- Ícones na navegação, resumos e categorias de produtos;
- Placeholders mais claros e visualmente diferentes dos valores digitados;
- Seletores pesquisáveis de clientes e funcionários na venda;
- Máscaras automáticas de CPF e telefone;
- Ícones automáticos de produtos, definidos pelo nome e pela descrição;
- Exemplos das palavras reconhecidas diretamente no formulário de produto;
- Tratamento de funcionários sem salário informado.

## Como executar

Instale as dependências:

```bash
npm install
```

Primeiro, deixe a API Spring Boot executando na porta `8080`. Depois, inicie o Expo:

```bash
npm run web
```

O navegador abrirá o aplicativo na tela de login. No teste web, o endereço padrão da API é:

```text
http://localhost:8080
```

## Como conectar à API

Para testar em um celular físico, copie `.env.example` para `.env` e informe o IP do computador que está executando o Spring Boot:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

No celular físico, o computador e o celular devem estar na mesma rede. Não use `localhost`, porque ele apontaria para o próprio celular.

No Android Emulator, normalmente pode ser usado:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

Depois de alterar o `.env`, pare e inicie o Expo novamente. A tela de login é sempre a primeira tela do aplicativo. Em desenvolvimento, a API cria o usuário inicial abaixo quando o banco está vazio:

```text
CPF: 00000000000
Senha: admin123
```

## Formato enviado ao registrar uma venda

```json
{
  "dataVenda": "2026-10-16",
  "clienteId": 1,
  "funcionarioId": 1,
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 2, "quantidade": 1 }
  ]
}
```

A API calcula o valor total, verifica o estoque e devolve a venda pronta. Se a quantidade for maior que o estoque disponível, o aplicativo mostra a mensagem da resposta `409`.

## Endpoints preparados no serviço

O arquivo `services/api.ts` possui funções para:

- `POST /auth/login` e `GET /auth/me`;
- CRUD de `/cliente` e consulta de `/cliente/{id}/vendas`;
- CRUD de `/funcionario` e consulta de `/funcionario/{id}/vendas`;
- CRUD de `/produto`;
- CRUD de `/venda`;
- `POST /assistente/pergunta`.

Nesta versão, a interface utiliza login, frente de caixa, histórico, assistente e o CRUD de produtos, clientes e funcionários.

O aplicativo não envia nenhum campo de ícone para a API. A escolha visual acontece apenas no mobile, usando palavras do nome e da descrição, portanto a API original continua compatível sem alterações.

## Como confirmar que a integração está funcionando

1. Abra a API e confirme que `http://localhost:8080/actuator/health` responde;
2. Execute `npm run web` no projeto mobile;
3. Entre com o CPF e a senha do usuário inicial;
4. Cadastre um produto, cliente ou funcionário pelo aplicativo;
5. Consulte o endpoint correspondente no Insomnia ou o banco para confirmar o cadastro;
6. Faça uma venda e confirme que o estoque foi reduzido na API.

Se a API estiver desligada, o login exibirá um erro de conexão e nenhuma informação local será carregada.

## Organização do código

- `components`: elementos reutilizáveis da interface;
- `models`: tipos que seguem as respostas da API;
- `screens`: telas principais;
- `services`: autenticação e comunicação HTTP;
- `theme`: cores e padrões visuais;
- `utils`: funções de formatação;
- `App.tsx`: estados, regras principais e ligação entre as telas.

Mais detalhes estão em `DOCUMENTACAO_VERSAO_05.md`.
