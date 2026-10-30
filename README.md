# Prontê Mobile

Aplicativo mobile do **Prontê**, um sistema de gerenciamento de vendas integrado a uma API REST desenvolvida com Spring Boot.

O projeto foi construído com React Native, Expo e TypeScript. Ele pode ser executado em celulares Android e iOS e também no navegador durante o desenvolvimento.

## Funcionalidades

- Login com CPF e senha;
- Autenticação com token JWT;
- Cadastro, edição e exclusão de clientes;
- Cadastro, edição e exclusão de funcionários;
- Cadastro, edição e exclusão de produtos;
- Registro de vendas com vários produtos e quantidades;
- Seleção pesquisável de clientes e funcionários;
- Histórico de vendas;
- Atualização de estoque realizada pela API;
- Máscaras automáticas para CPF e telefone;
- Ícones de produtos definidos pelo nome e pela descrição;
- Assistente de IA para perguntas sobre o estoque;
- Modo demonstração com dados locais para testar sem servidor;
- Identidade visual oficial nas telas de login, início e abertura;
- Tela de configurações com atualização dos dados e controle da sessão;
- Tela de informações sobre privacidade e tratamento de dados;
- Configuração pronta para gerar APKs de produção e homologação.

## Tecnologias

- React Native;
- Expo;
- TypeScript;
- React Native Web;
- Expo Vector Icons;
- API REST com Spring Boot;
- Autenticação JWT.

## Ambientes da API

O aplicativo usa automaticamente a API de produção, sem exigir um arquivo `.env`:

```text
https://api.20-151-6-104.sslip.io
```

Também é possível trocar o ambiente sem alterar o código:

| Ambiente | Endereço |
| --- | --- |
| Produção (padrão) | `https://api.20-151-6-104.sslip.io` |
| Homologação | `https://hml.20-151-6-104.sslip.io` |
| API local | `http://localhost:8080` |

Para usar homologação ou uma API local, copie `.env.example`, renomeie a cópia para `.env` e deixe o endereço desejado em `EXPO_PUBLIC_API_URL`. Depois, reinicie o Expo com `npx expo start -c`.

O servidor publicado pode ser desligado pela equipe quando não estiver sendo utilizado. Nesse caso, o aplicativo continuará abrindo normalmente, mas o login dependerá de o servidor ser ligado novamente.

### Compartilhamento dos dados

Na estrutura atual, todos os funcionários autenticados na mesma API utilizam o mesmo banco de dados. Produtos, clientes, funcionários e vendas não são separados por conta ou por empresa.

Para atender várias lojas com dados independentes, a API precisará implementar uma separação por empresa, loja ou organização e vincular cada funcionário a uma delas.

## Testar sem servidor

O modo demonstração permite navegar por todas as telas sem iniciar a API, o MySQL ou o servidor publicado. Ele inclui produtos, clientes, funcionários e vendas de exemplo. Também permite fazer cadastros, edições, exclusões e novas vendas localmente.

No PowerShell, dentro da pasta do projeto, execute:

```powershell
Copy-Item .env.demo.example .env
npx expo start -c
```

No Prompt de Comando, use:

```bat
copy .env.demo.example .env
npx expo start -c
```

Na tela de login, selecione **Entrar sem servidor**. Não é necessário preencher CPF ou senha.

Os dados da demonstração ficam somente na memória e voltam ao estado inicial quando a página ou o aplicativo é completamente recarregado. Para retornar à API real, exclua o arquivo `.env` e reinicie o Expo:

```powershell
Remove-Item .env
npx expo start -c
```

O modo demonstração é desativado por padrão e não deve ser habilitado na versão enviada à Play Store.

## Antes de começar

Para executar somente o aplicativo com a API publicada, são necessários:

| Programa | Para que serve |
| --- | --- |
| [Node.js LTS](https://nodejs.org/) | Executar o projeto React Native/Expo |
| [Git](https://git-scm.com/downloads) | Clonar o repositório, se necessário |
| [Expo Go](https://expo.dev/go) | Testar o aplicativo em um celular físico |

JDK 17 e MySQL são necessários apenas para executar uma cópia local da API. O roteiro completo dos dois modos está em [`GUIA_CONFIGURACAO_DO_ZERO.md`](GUIA_CONFIGURACAO_DO_ZERO.md).

## 1. Conferir o Node.js

Abra o PowerShell ou o Prompt de Comando e execute:

```powershell
node -v
npm -v
```

Se o PowerShell bloquear `npm.ps1`, use `npm.cmd` nos comandos ou abra um terminal do tipo **Command Prompt** no VS Code.

## 2. Instalar o aplicativo

Abra um terminal na pasta do Prontê Mobile:

```powershell
cd C:\caminho\para\Pronte-Mobile-v1.0.1
```

Instale as dependências:

```powershell
npm install
```

## 3. Executar no navegador

Execute no terminal do aplicativo:

```powershell
npm run web
```

O Expo abrirá o aplicativo no navegador. O endereço padrão da API é:

```text
https://api.20-151-6-104.sslip.io
```

O navegador aplica regras de CORS. Se a API publicada não autorizar o endereço local do Expo, use o aplicativo no Expo Go ou peça à equipe da API para liberar a origem exibida pelo navegador.

## 4. Executar em um celular físico

Inicie o Expo:

```powershell
npm start
```

Abra o Expo Go no celular e leia o QR Code mostrado no terminal ou no navegador. Se o Windows solicitar autorização de rede para o Node.js ou Java, permita o acesso em redes privadas.

Com a API publicada, o celular acessa o servidor HTTPS diretamente e não precisa usar o IPv4 do computador. A mesma rede Wi-Fi e o endereço `http://192.168...:8080` só são necessários ao testar uma API local.

Depois de alterar um `.env`, reinicie o Expo limpando o cache:

```powershell
npx expo start -c
```

## 5. Executar no Android Emulator

Com a API publicada, basta executar:

```powershell
npm run android
```

O endereço abaixo só deve ser usado no `.env` quando a API estiver rodando localmente no computador:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

## 6. Testar a integração

Com a API e o aplicativo funcionando:

1. Faça login;
2. Cadastre um cliente;
3. Cadastre um funcionário;
4. Cadastre um produto com estoque maior que zero;
5. Registre uma venda;
6. Confira se o estoque do produto diminuiu;
7. Atualize as listas e confirme que os dados continuam disponíveis.

Se o aplicativo abrir a tela de login e carregar os cadastros depois da autenticação, a comunicação com a API está funcionando.

## Endpoints utilizados

| Função | Endpoint |
| --- | --- |
| Login | `POST /auth/login` |
| Usuário logado | `GET /auth/me` |
| Clientes | `/cliente` |
| Funcionários | `/funcionario` |
| Produtos | `/produto` |
| Vendas | `/venda` |
| Assistente de estoque | `POST /assistente/pergunta` |
| Estado da API | `GET /actuator/health` |

Todas as rotas, exceto o login e o estado da API, exigem o token JWT recebido na autenticação. O aplicativo envia esse token automaticamente.

## Ícones dos produtos

A API não precisa armazenar um campo de ícone. O próprio aplicativo escolhe o ícone utilizando palavras presentes no nome ou na descrição do produto.

| Categoria visual | Exemplos reconhecidos |
| --- | --- |
| Café | café, cappuccino |
| Bebida | água, suco, refrigerante, chá |
| Gelado | sorvete, picolé |
| Doce | chocolate, doce, bala |
| Lanche | coxinha, salgado, pão, esfirra, hambúrguer, lanche |
| Pizza | pizza |
| Natural | salada, fruta, natural |
| Padrão | qualquer outro produto |

## Comandos do projeto

| Comando | Ação |
| --- | --- |
| `npm start` | Inicia o Expo |
| `npm run web` | Abre no navegador |
| `npm run android` | Abre no Android |
| `npm run ios` | Abre no iOS, quando disponível |
| `npm run check` | Verifica os tipos TypeScript |
| `npm run doctor` | Verifica a compatibilidade do projeto Expo |
| `npm run build:apk` | Gera o APK conectado à produção pelo EAS |
| `npm run build:apk:hml` | Gera o APK conectado à homologação pelo EAS |

## Gerar um APK instalável

A versão 1.0.1 já possui nome, identificador Android, ícones, tela de abertura e perfis de compilação configurados.

O APK final é compilado e assinado pelo EAS. O passo a passo inclui a criação da conta Expo, os comandos, as respostas às perguntas da primeira compilação, o download e a instalação no celular:

[`GUIA_GERAR_APK.md`](GUIA_GERAR_APK.md)

Para gerar uma nova versão usando a mesma assinatura e atualizar o APK já instalado:

[`GUIA_ATUALIZAR_APK.md`](GUIA_ATUALIZAR_APK.md)

Para a entrega final, utilize o perfil `apk-producao`. Ele aponta para a API publicada e mantém o modo demonstração desativado.

## Problemas comuns

### `No compiler is provided in this environment`

O computador está usando um JRE ou o `JAVA_HOME` está incorreto. Instale o JDK 17 e confira:

```powershell
where.exe java
where.exe javac
java -version
javac -version
```

### Erro de conexão com o MySQL

Confirme se o serviço do MySQL está iniciado, se o banco `projeto` existe e se usuário e senha estão corretos no `application.properties`.

### `Network request failed`

- Confirme com a equipe se o servidor publicado está ligado;
- Abra `https://api.20-151-6-104.sslip.io/actuator/health` no navegador;
- Confira se o `.env` não está substituindo o endereço padrão por um endereço antigo;
- Depois de mudar o `.env`, reinicie com `npx expo start -c`;
- Para API local no celular físico, não use `localhost`: use o IPv4 do computador e a mesma rede Wi-Fi.

### Resposta `401`

O login está incorreto ou o token expirou. Entre novamente. Se o banco já possuía funcionários, o administrador padrão pode não ter sido criado.

### Assistente responde `503`

O restante do sistema continua funcionando. Esse endpoint depende da variável `MISTRAL_API_KEY` configurada na API.

## Estrutura principal

```text
components/  Componentes reutilizáveis
assets/      Logotipo e recursos visuais
models/      Tipos utilizados pelo aplicativo
screens/     Telas do sistema
services/    Comunicação com a API
theme/       Cores e padrões visuais
utils/       Máscaras, ícones e formatações
App.tsx      Navegação, estados e regras principais
```

As alterações da integração com o servidor estão em [`DOCUMENTACAO_VERSAO_06.md`](DOCUMENTACAO_VERSAO_06.md), o modo demonstração em [`DOCUMENTACAO_VERSAO_07.md`](DOCUMENTACAO_VERSAO_07.md), a identidade visual e os ajustes para celulares em [`DOCUMENTACAO_VERSAO_08.md`](DOCUMENTACAO_VERSAO_08.md), a preparação da entrega instalável em [`DOCUMENTACAO_VERSAO_10.md`](DOCUMENTACAO_VERSAO_10.md) e a correção da abertura do aplicativo em [`DOCUMENTACAO_VERSAO_101.md`](DOCUMENTACAO_VERSAO_101.md).

## Responsável pelo front-end mobile

**Diego** — desenvolvimento da interface mobile, integração com a API e adaptação do Design System do Prontê.
