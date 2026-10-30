# Guia de configuração do Prontê do zero

Este guia registra todo o processo necessário para configurar novamente a API Spring Boot, o banco MySQL, o aplicativo React Native/Expo e o repositório GitHub em um computador Windows.

O passo a passo considera também computadores de laboratório, nos quais o usuário pode não possuir permissão de administrador.

## Visão geral

Para usar a API publicada, somente o terminal do aplicativo precisa ficar aberto. Para desenvolver a API localmente, dois terminais ficarão abertos:

```text
Terminal 1: API Spring Boot na porta 8080
Terminal 2: aplicativo Expo no navegador ou celular
```

O processo completo é:

```text
Escolher API publicada ou local
        ↓
Instalar ou preparar os programas
        ↓
Configurar o JDK 17
        ↓
Criar o banco MySQL
        ↓
Configurar e iniciar a API
        ↓
Instalar as dependências do aplicativo
        ↓
Iniciar o Expo
        ↓
Fazer login e testar a integração
```

---

## 1. Programas necessários

| Programa | Finalidade | Download oficial |
| --- | --- | --- |
| Visual Studio Code | Abrir e editar os projetos | <https://code.visualstudio.com/> |
| JDK 17 | Compilar e executar a API | <https://adoptium.net/temurin/releases/?version=17> |
| Node.js LTS | Executar o Expo e instalar dependências | <https://nodejs.org/pt-br/download> |
| MySQL Server e Workbench | Banco de dados e interface de administração | <https://dev.mysql.com/downloads/installer/> |
| Git para Windows | Baixar e enviar o código para o GitHub | <https://git-scm.com/downloads/win> |
| Expo Go | Testar em um celular físico | <https://expo.dev/go> |

O Maven não precisa ser instalado, pois a API possui os arquivos `mvnw` e `mvnw.cmd`.

### Conferir o que já está instalado

Abra o **Visual Studio Code**. No menu superior, clique em:

```text
Terminal → New Terminal
```

Execute:

```powershell
node -v
npm.cmd -v
git --version
java -version
javac -version
```

Resultados esperados:

- `node` e `npm` devem mostrar uma versão;
- `git` deve mostrar uma versão;
- `java` e `javac` devem mostrar a versão 17.

Se aparecer `java version "1.8"`, o computador está usando Java 8 e o JDK 17 ainda precisa ser configurado.

---

## 2. Preparar as pastas dos projetos

Não abra os projetos diretamente dentro de um arquivo ZIP.

1. Clique com o botão direito no ZIP;
2. Clique em **Extrair Tudo**;
3. Escolha uma pasta pertencente ao seu usuário.

Em um computador com restrições, prefira:

```text
C:\Users\SEU_USUARIO\Downloads\Pronte
```

Evite pastas do sistema, `Program Files` ou diretórios de outros usuários.

A organização pode ficar assim:

```text
Pronte\
├── Projeto-API-main\
└── Pronte-Mobile-v1.0.1\
```

Para abrir um projeto no VS Code:

```text
File → Open Folder → selecione a pasta do projeto → Select Folder
```

---

## 3. Configurar o JDK 17 sem permissão de administrador

Esta é a forma utilizada no computador da faculdade.

### 3.1 Baixar o JDK

Na página do Eclipse Temurin, escolha:

```text
Version: 17
Operating System: Windows
Architecture: x64
Package Type: JDK
Archive Type: .zip
JVM: HotSpot
```

É importante escolher **JDK**, e não apenas JRE.

### 3.2 Extrair o ZIP

1. Clique com o botão direito no arquivo baixado;
2. Clique em **Extrair Tudo**;
3. Extraia para a pasta `Downloads`.

Exemplo de caminho:

```text
C:\Users\diegofarias\Downloads\jdk-17.0.12_windows-x64_bin\jdk-17.0.12
```

A pasta correta precisa conter:

```text
bin
conf
include
jmods
lib
```

Dentro de `bin` deve existir o arquivo `java.exe`.

### 3.3 Configurar no PowerShell atual

No terminal PowerShell do VS Code, execute com o caminho verdadeiro do JDK:

```powershell
$env:JAVA_HOME = "C:\Users\diegofarias\Downloads\jdk-17.0.12_windows-x64_bin\jdk-17.0.12"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

Não pode existir espaço entre `$env:` e `JAVA_HOME`.

Confira o arquivo:

```powershell
Test-Path "$env:JAVA_HOME\bin\java.exe"
```

Resultado esperado:

```text
True
```

Depois confira as versões:

```powershell
java -version
javac -version
```

Resultado esperado:

```text
java version "17..."
javac 17...
```

Essa configuração vale apenas para o terminal atual. Se o terminal for fechado, repita os dois comandos de `JAVA_HOME` e `Path`.

### 3.4 Se continuar aparecendo Java 8

Execute:

```powershell
where.exe java
where.exe javac
$env:JAVA_HOME
```

Depois execute novamente:

```powershell
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

O caminho do JDK 17 precisa ficar antes do caminho do Java 8.

---

## 4. Preparar o MySQL

### 4.1 Abrir o Workbench

1. Abra o menu Iniciar do Windows;
2. Pesquise por **MySQL Workbench**;
3. Abra o programa;
4. Em **MySQL Connections**, clique na conexão local, normalmente chamada `Local instance MySQL80`;
5. Informe a senha do usuário `root`.

### 4.2 Criar o banco

Clique no botão de nova aba SQL ou em:

```text
File → New Query Tab
```

Cole:

```sql
CREATE DATABASE IF NOT EXISTS projeto
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Clique no ícone de raio para executar.

No painel **SCHEMAS**, clique com o botão direito e depois em **Refresh All**. O banco `projeto` deverá aparecer.

As tabelas serão criadas automaticamente pela API.

---

## 5. Configurar a API

Abra a pasta `Projeto-API-main` no VS Code.

Na lateral esquerda, abra:

```text
src
└── main
    └── resources
        └── application.properties
```

Confira estas propriedades:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/projeto
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_DO_MYSQL
spring.jpa.hibernate.ddl-auto=update
```

Não coloque aspas na senha.

Se o usuário `root` realmente não possuir senha, use:

```properties
spring.datasource.password=
```

Salve com `Ctrl + S`.

### Erro que indica senha vazia

Se aparecer:

```text
Access denied for user 'root'@'localhost' (using password: NO)
```

O `application.properties` está tentando acessar o MySQL sem senha. Coloque a mesma senha utilizada no MySQL Workbench.

O erro `Unable to determine Dialect` aparece como consequência da falha de conexão. Não é necessário configurar manualmente o dialect.

---

## 6. Executar a API

Abra um terminal no VS Code:

```text
Terminal → New Terminal
```

Se for necessário configurar novamente o JDK 17, execute:

```powershell
$env:JAVA_HOME = "CAMINHO_DA_PASTA_DO_JDK_17"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

Entre na pasta da API, caso o terminal não esteja nela:

```powershell
cd "C:\caminho\para\Projeto-API-main"
```

Execute:

```powershell
.\mvnw.cmd spring-boot:run
```

Na primeira execução, o Maven baixará as dependências. Aguarde até aparecer:

```text
Started ProjetoApplication
```

O terminal precisa continuar aberto.

### Confirmar a API

Abra no navegador:

```text
http://localhost:8080/actuator/health
```

Resposta esperada:

```json
{"status":"UP"}
```

### Primeiro login

Quando o banco está vazio, a API cria o usuário:

```text
CPF: 00000000000
Senha: admin123
```

Ele só é criado quando não existe nenhum funcionário no banco.

---

## 7. Preparar o aplicativo mobile

Mantenha o terminal da API aberto.

Abra outra janela do VS Code:

```text
File → New Window
File → Open Folder
```

Selecione a pasta:

```text
Pronte-Mobile-v1.0.1
```

Abra outro terminal:

```text
Terminal → New Terminal
```

Confira o Node:

```powershell
node -v
npm.cmd -v
```

### 7.1 Instalar as dependências

Execute:

```powershell
npm.cmd install
```

O projeto não inclui a pasta `node_modules`, pois ela é grande e deve ser criada em cada computador.

Antes do `npm install`, o VS Code pode mostrar vários erros como:

```text
Cannot find module 'react'
Cannot find module 'react-native'
Cannot find module 'expo'
```

Isso é esperado até as dependências serem instaladas.

### 7.2 Verificar o TypeScript

```powershell
npm.cmd run check
```

Se não aparecer erro de TypeScript, a instalação está correta.

Se o VS Code continuar mostrando erros antigos:

1. Pressione `Ctrl + Shift + P`;
2. Pesquise `TypeScript: Restart TS Server`;
3. Pressione Enter;
4. Se necessário, use `Developer: Reload Window`.

### Erro do `npm.ps1`

Em computadores com PowerShell restrito pode aparecer:

```text
npm.ps1 não está assinado digitalmente
PSSecurityException
```

Não é necessário alterar a política de segurança. Utilize sempre:

```powershell
npm.cmd install
npm.cmd run check
npm.cmd run web
```

Também é possível abrir o CMD no VS Code:

```text
Terminal → seta ao lado do botão + → Command Prompt
```

No CMD, o comando comum `npm` funciona normalmente.

O aviso sobre `PSReadLine` e leitor de tela pode ser ignorado, pois não está relacionado ao projeto.

### 7.3 Escolher o ambiente da API

Sem um arquivo `.env`, o aplicativo usa automaticamente a API de produção:

```text
https://api.20-151-6-104.sslip.io
```

Para trocar de ambiente, copie `.env.example`, renomeie a cópia para `.env` e deixe apenas o endereço desejado ativo:

```env
# Produção
EXPO_PUBLIC_API_URL=https://api.20-151-6-104.sslip.io

# Homologação
# EXPO_PUBLIC_API_URL=https://hml.20-151-6-104.sslip.io

# Desenvolvimento local
# EXPO_PUBLIC_API_URL=http://localhost:8080
```

Depois de alterar o `.env`, pare o Expo com `Ctrl + C` e execute:

```powershell
npx.cmd expo start -c
```

---

## 8. Executar o aplicativo no navegador

Se estiver usando a API publicada, não é necessário iniciar o Spring Boot ou o MySQL neste computador. Se estiver usando a API local, confirme primeiro que ela continua rodando na porta `8080`.

No terminal do aplicativo, execute:

```powershell
npm.cmd run web
```

O navegador deverá abrir o aplicativo. Sem um `.env`, o endereço padrão da API é:

```text
https://api.20-151-6-104.sslip.io
```

Faça login com:

```text
CPF: 00000000000
Senha: admin123
```

Se o banco já possuía funcionários, use o CPF e a senha de um funcionário existente.

---

## 9. Executar no celular físico

O computador e o celular só precisam estar na mesma rede Wi-Fi quando o aplicativo usar uma API local. Com a API publicada, basta que ambos tenham acesso à internet.

### 9.1 Descobrir o endereço do computador

Esta etapa só é necessária quando o celular utilizar uma API local. Para a API publicada, o aplicativo usa o endereço HTTPS e não precisa do IPv4 do computador.

No PowerShell ou CMD:

```powershell
ipconfig
```

Procure o **Endereço IPv4** da conexão Wi-Fi. Exemplo:

```text
192.168.0.10
```

### 9.2 Criar o `.env`

Na pasta do mobile:

1. Localize `.env.example`;
2. Copie o arquivo;
3. Renomeie a cópia para `.env`;
4. Abra o `.env`;
5. Coloque o IPv4 do computador.

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Não use `localhost` no celular, pois ele apontaria para o próprio celular.

### 9.3 Abrir no Expo Go

1. Instale o Expo Go no celular;
2. No terminal do aplicativo, execute:

```powershell
npm.cmd start
```

3. Abra o Expo Go;
4. Leia o QR Code exibido pelo Expo;
5. Se o Windows perguntar sobre o firewall, permita Java e Node.js em redes privadas.

Depois de alterar o `.env`, reinicie limpando o cache:

```powershell
npx.cmd expo start -c
```

---

## 10. Testar a integração completa

Com a API e o aplicativo abertos:

1. Faça login;
2. Abra **Mais → Clientes**;
3. Cadastre um cliente;
4. Abra **Mais → Funcionários**;
5. Cadastre um funcionário;
6. Abra **Produtos**;
7. Cadastre um produto com estoque maior que zero;
8. Abra **Vendas**;
9. Pesquise e selecione o cliente;
10. Escolha o vendedor;
11. Adicione uma quantidade do produto;
12. Finalize a venda;
13. Volte aos produtos e confira se o estoque diminuiu;
14. Atualize os schemas do MySQL Workbench e confira os registros.

Se o aplicativo abre a tela de login, autentica e carrega os dados, a integração está funcionando.

---

## 11. Enviar o projeto para o GitHub

### 11.1 Forma recomendada para configurar novamente

Como o repositório já existe, prefira cloná-lo em vez de iniciar outro histórico com `git init`.

Abra uma pasta pertencente ao seu usuário, como `Downloads`. Clique com o botão direito dentro dela e use **Open in Terminal**, ou abra pelo terminal do VS Code.

Execute:

```powershell
git clone https://github.com/Projeto-QualidadeDeSoftware/Projeto-FrontMobile.git
cd Projeto-FrontMobile
npm.cmd install
```

Isso evita o erro `fetch first` causado por históricos separados.

### 11.2 Arquivos que não devem ser enviados

O `.gitignore` deve conter:

```gitignore
node_modules/
.expo/
dist/
dist-test*/
.env
```

O `.env.example` deve continuar no repositório, pois ele não contém a configuração particular do computador.

### 11.3 Enviar alterações

Dentro da pasta do repositório:

```powershell
git status
git add .
git commit -m "feat: atualiza front-end mobile"
git push
```

### Erro de permissão no `git add .`

Se o computador da faculdade negar acesso:

1. Feche o projeto no VS Code;
2. Copie o projeto para uma pasta do usuário, como `Downloads`;
3. Não copie `.git`, `node_modules`, `.expo`, `dist` e `.env` ao preparar uma cópia limpa;
4. Abra a nova pasta pelo menu `File → Open Folder`;
5. Tente novamente.

Se aparecer:

```text
Unable to create '.git/index.lock': Permission denied
```

Feche outros processos do Git. Se nenhum Git estiver rodando e o arquivo existir, execute:

```powershell
Remove-Item .git\index.lock
```

### Erro `fetch first`

Esse erro significa que o GitHub possui commits que não estão no projeto local.

Não utilize `git push --force` em um repositório do grupo.

Execute:

```powershell
git fetch origin
git merge origin/main --allow-unrelated-histories
```

Se aparecer conflito, abra o arquivo na aba **Source Control** do VS Code:

- `Accept Current Change`: mantém o arquivo local;
- `Accept Incoming Change`: mantém o arquivo do GitHub;
- `Accept Both Changes`: mantém os dois para revisão.

Depois:

```powershell
git add .
git commit -m "merge: integra projeto mobile ao repositório"
git push -u origin main
```

---

## 12. Rotina para abrir o sistema depois de configurado

### Opção A — API publicada

Abra a pasta do mobile e execute:

```powershell
npm.cmd run web
```

O aplicativo tentará acessar `https://api.20-151-6-104.sslip.io`. A equipe pode manter a VPS desligada fora dos períodos de uso para evitar custos; nesse caso, aguarde o servidor ser ligado.

### Opção B — API local

#### Terminal 1 — API

Abra a pasta da API no VS Code e execute:

```powershell
$env:JAVA_HOME = "CAMINHO_DA_PASTA_DO_JDK_17"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd spring-boot:run
```

Aguarde:

```text
Started ProjetoApplication
```

#### Terminal 2 — aplicativo

Abra a pasta do mobile em outra janela do VS Code:

```powershell
npm.cmd run web
```

Não é necessário executar `npm install` toda vez. Repita a instalação somente quando baixar o projeto em outro computador, apagar `node_modules` ou quando as dependências do `package.json` mudarem.

---

## 13. Tabela de erros rápidos

| Erro | Causa | Solução |
| --- | --- | --- |
| `No compiler is provided` | JRE ou Java incorreto | Configurar o JDK 17 |
| `java version 1.8` | Java 8 está na frente do JDK 17 | Ajustar `JAVA_HOME` e `Path` no terminal |
| `npm.ps1 não está assinado` | PowerShell bloqueou o script | Usar `npm.cmd` |
| Imports vermelhos no VS Code | `node_modules` ausente | Executar `npm.cmd install` |
| `Access denied ... using password: NO` | Senha do MySQL vazia | Preencher `spring.datasource.password` |
| `Unable to determine Dialect` | API não conseguiu acessar o banco | Corrigir primeiro a conexão com o MySQL |
| `Network request failed` | Servidor publicado desligado, API local parada ou URL incorreta | Conferir o health do ambiente e o `.env` |
| Resposta `401` | Login inválido ou token expirado | Entrar novamente |
| Assistente responde `503` | Chave da Mistral ausente | Configurar `MISTRAL_API_KEY`; o restante funciona normalmente |
| `git add` com permissão negada | Pasta ou arquivo protegido | Trabalhar em uma pasta do usuário |
| `push rejected (fetch first)` | GitHub possui commits ausentes localmente | Fazer `fetch` e `merge`; não usar `--force` |

---

## Checklist final

- [ ] Projeto extraído fora do ZIP;
- [ ] Node e npm funcionando;
- [ ] Git funcionando;
- [ ] JDK 17 ativo no terminal;
- [ ] MySQL iniciado;
- [ ] Banco `projeto` criado;
- [ ] Senha correta no `application.properties`;
- [ ] API exibindo `Started ProjetoApplication`;
- [ ] Health respondendo `UP`;
- [ ] Dependências do mobile instaladas;
- [ ] `npm.cmd run check` sem erros;
- [ ] Expo aberto;
- [ ] Login funcionando;
- [ ] Cadastro e venda testados;
- [ ] `.env` e `node_modules` fora do GitHub.
