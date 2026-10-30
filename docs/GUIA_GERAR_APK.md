# Guia para gerar e instalar o APK do Prontê 1.0.1

Este é o roteiro para transformar o projeto em um aplicativo Android instalável, sem depender do Expo Go e sem publicar na Play Store.

## O que será gerado

O projeto já está preparado com:

- Nome do aplicativo: **Prontê**;
- Versão: **1.0.1**;
- Identificador Android: `br.com.pronte.mobile`;
- Ícone e tela de abertura da identidade visual;
- API de produção configurada no perfil `apk-producao`;
- API de homologação configurada no perfil `apk-homologacao`;
- Modo demonstração desativado nos dois APKs;
- Assinatura digital Android administrada pelo EAS.

O fluxo é este:

1. O código é enviado ao serviço de compilação do Expo;
2. O Expo compila e assina o aplicativo;
3. Um link para baixar o arquivo `.apk` é exibido;
4. O APK pode ser instalado diretamente em um celular Android.

O APK instalado funciona sem o Expo Go, sem o cabo USB e sem deixar o computador ligado. Ele ainda precisa de internet para acessar a API publicada.

## Antes de começar

Você precisa de:

| Item | Para que serve |
| --- | --- |
| Node.js LTS | Executar os comandos do projeto |
| Conta gratuita no Expo | Compilar e assinar o APK |
| Projeto extraído do ZIP | A compilação não deve ser feita dentro do ZIP |
| Internet | Enviar o projeto e baixar o APK pronto |

Crie uma conta em <https://expo.dev/signup> e confirme o e-mail antes de continuar.

Não é necessário ter conta de desenvolvedor da Google Play para gerar este APK.

## 1. Extrair e abrir o projeto

1. Clique com o botão direito em `Pronte-Mobile-v1.0.1.zip`;
2. Clique em **Extrair Tudo**;
3. Escolha uma pasta dentro de `Documentos` ou `Downloads`;
4. Abra o Visual Studio Code;
5. Clique em **File → Open Folder**;
6. Selecione a pasta `Pronte-Mobile-v1.0.1`;
7. Clique em **Select Folder**.

Não abra somente um arquivo isolado. O VS Code precisa estar com a pasta inteira do projeto aberta.

## 2. Abrir o terminal do VS Code

No menu superior, clique em:

```text
Terminal → New Terminal
```

O caminho exibido deve terminar na pasta do projeto. Exemplo:

```text
PS C:\Users\SeuUsuario\Downloads\Pronte-Mobile-v1.0.1>
```

Se estiver em outra pasta, entre no projeto com:

```powershell
cd "C:\caminho\para\Pronte-Mobile-v1.0.1"
```

## 3. Conferir o Node.js

No terminal, execute:

```powershell
node -v
npm.cmd -v
```

Os dois comandos devem mostrar uma versão. O uso de `npm.cmd` evita o bloqueio de scripts `npm.ps1` que costuma acontecer no PowerShell de computadores da faculdade.

Se `node` não for reconhecido, instale a versão LTS em <https://nodejs.org/> e abra o VS Code novamente.

## 4. Instalar e validar o projeto

Execute um comando por vez:

```powershell
npm.cmd install
npm.cmd run check
npm.cmd run doctor
```

Resultados esperados:

- `npm install`: termina sem erro;
- `npm run check`: não apresenta erro do TypeScript;
- `npm run doctor`: mostra `21/21 checks passed` ou a quantidade atual completa, sem falhas.

Avisos que começam com `npm warn` não interrompem a compilação. O que impede continuar são mensagens `npm error`, `ERROR` ou um comando encerrado com falha.

## 5. Instalar a ferramenta de compilação

Execute:

```powershell
npm.cmd install --global eas-cli
```

Depois confira:

```powershell
eas.cmd --version
```

Se o computador não permitir uma instalação global, use a alternativa abaixo nos passos seguintes:

```powershell
npx.cmd eas-cli@latest --version
```

Nesse caso, substitua `eas.cmd` por `npx.cmd eas-cli@latest` em cada comando do restante do guia.

## 6. Entrar na conta Expo

Execute:

```powershell
eas.cmd login
```

Digite o usuário ou e-mail e a senha da conta Expo. A senha pode não aparecer enquanto é digitada; isso é normal no terminal.

Confira a conta conectada:

```powershell
eas.cmd whoami
```

O terminal deve mostrar o nome da sua conta.

## 7. Gerar o APK de produção

Execute:

```powershell
eas.cmd build --platform android --profile apk-producao
```

Também é possível usar o atalho do projeto:

```powershell
npm.cmd run build:apk
```

Na primeira compilação, podem aparecer estas perguntas:

| Pergunta aproximada no terminal | Resposta |
| --- | --- |
| Inicializar um repositório Git? | `Y`, se o projeto foi aberto a partir do ZIP |
| Criar o primeiro commit do Git? | `Y`, se essa pergunta aparecer |
| Criar automaticamente um projeto no EAS? | `Y` |
| Vincular este diretório ao projeto criado? | `Y` |
| Gerar uma nova Android Keystore? | `Y` |
| Deseja continuar com alterações locais? | `Y`, depois de confirmar que os arquivos estão salvos |

A **keystore** é a chave que assina o aplicativo. Use a mesma conta Expo nas próximas versões, porque uma atualização precisa conservar a mesma assinatura.

Se o projeto já foi clonado do GitHub, ele já possui o repositório Git e essas duas primeiras perguntas não aparecem. Se você abriu o ZIP, o próprio EAS pode oferecer a inicialização necessária.

O envio pode levar alguns minutos. Depois disso, o terminal exibirá um endereço para acompanhar a compilação. Você pode abrir esse link no navegador.

## 8. Baixar o APK

Quando a página mostrar **Build finished** ou **Complete**:

1. Clique em **Download**;
2. Salve o arquivo `.apk`;
3. Renomeie para um nome fácil de entregar, por exemplo:

```text
Pronte-Mobile-1.0.1.apk
```

Renomear o arquivo não altera o aplicativo nem sua assinatura.

## 9. Instalar no celular Android

Você pode enviar o APK para o celular pelo Google Drive, cabo USB, e-mail ou link de download.

No celular:

1. Abra o arquivo `Pronte-Mobile-1.0.1.apk`;
2. Se o Android bloquear, toque em **Configurações**;
3. Autorize **Instalar apps desconhecidos** apenas para o aplicativo usado na abertura, como Arquivos, Drive ou Chrome;
4. Volte e toque em **Instalar**;
5. Depois da instalação, toque em **Abrir**.

O nome exato das opções muda um pouco entre Samsung, Motorola, Xiaomi e outras marcas. Não é necessário desativar permanentemente o Play Protect.

## 10. Confirmar que é um aplicativo independente

Faça este teste:

1. Feche o Expo Go no celular;
2. Feche o terminal e o VS Code no computador;
3. Desligue o computador, se quiser ter certeza;
4. Abra o ícone **Prontê** instalado no celular;
5. Faça login com um usuário da API de produção.

Se o aplicativo abrir e carregar os dados, o APK está independente. A API publicada precisa continuar on-line, pois os cadastros ficam no banco do servidor.

## 11. Teste mínimo antes da entrega

Use uma conta de teste e confira:

- Login e encerramento da sessão;
- Lista e cadastro de clientes;
- Lista e cadastro de funcionários;
- Lista, cadastro e edição de produtos;
- Registro de uma venda e baixa do estoque;
- Histórico de vendas;
- Pesquisa em listas extensas;
- Assistente de estoque, quando a chave da IA estiver disponível;
- Tela de configurações e informações de privacidade;
- Layout com o teclado aberto e com os botões de navegação do Android.

Depois, feche e abra o aplicativo novamente. Nesta versão, um reinício completo pode solicitar novo login; os dados permanecem salvos na API.

## 12. APK de homologação

Para gerar um APK conectado ao ambiente de homologação, execute:

```powershell
eas.cmd build --platform android --profile apk-homologacao
```

Ou:

```powershell
npm.cmd run build:apk:hml
```

Os APKs de produção e homologação usam o mesmo identificador Android. Por isso, instalar um deles sobre o outro substitui a instalação anterior. Para a entrega ao professor, use o APK de **produção**.

## 13. Conferir a integridade do arquivo

No PowerShell, entre na pasta onde o APK foi baixado e execute:

```powershell
Get-FileHash .\Pronte-Mobile-1.0.1.apk -Algorithm SHA256
```

Guarde o valor exibido junto do link de entrega. Quem baixar pode executar o mesmo comando; valores iguais confirmam que o arquivo não foi alterado.

## 14. Como enviar ao professor

Uma entrega simples pode conter:

- `Pronte-Mobile-1.0.1.apk`;
- Link do repositório GitHub;
- Este guia de instalação;
- CPF e senha de um usuário de teste enviados por um canal adequado;
- Link ou endereço da API de produção;
- Valor SHA-256 do APK;
- Pequeno vídeo ou capturas mostrando login, cadastro e venda.

Prefira publicar o APK em uma **Release do GitHub** ou armazená-lo no Drive. Evite adicionar o arquivo binário diretamente aos commits comuns do repositório.

## 15. Como gerar uma atualização depois

Para a versão seguinte:

1. Mantenha `br.com.pronte.mobile` como identificador;
2. Continue usando a mesma conta e a mesma keystore do EAS;
3. Altere `version` no `app.json`, por exemplo para `1.0.1`;
4. Aumente `android.versionCode` de `1` para `2`;
5. Altere também `version` no `package.json`;
6. Execute novamente o perfil `apk-producao`.

O `versionCode` precisa aumentar em toda nova versão Android. Se a assinatura for a mesma, instalar o APK novo atualiza o anterior.

## Problemas comuns

### `npm.ps1 não pode ser carregado`

Use `npm.cmd` e `npx.cmd`, como mostrado neste guia, ou abra um terminal **Command Prompt** no VS Code.

### `eas não é reconhecido`

Feche e abra o terminal depois da instalação global. Se continuar, use:

```powershell
npx.cmd eas-cli@latest build --platform android --profile apk-producao
```

### Erro de login do Expo

Entre em <https://expo.dev/> pelo navegador, confirme o e-mail e verifique se usuário e senha estão corretos. Depois execute `eas.cmd login` novamente.

### A compilação ficou na fila

Contas gratuitas podem aguardar na fila. O computador pode ser usado normalmente; acompanhe o link informado pelo EAS.

### `App not installed` ou conflito de assinatura

Isso costuma acontecer quando já existe no celular outro aplicativo com o mesmo identificador, mas assinado com uma chave diferente. Se for apenas um aparelho de teste, desinstale a versão antiga e instale o novo APK. A desinstalação remove dados locais, mas não apaga o banco da API.

Para atualizações oficiais, sempre use o mesmo projeto, a mesma conta Expo e a mesma keystore.

### O aplicativo instala, mas não faz login

1. Confirme se o celular tem internet;
2. Abra `https://api.20-151-6-104.sslip.io/actuator/health` no navegador do celular;
3. Confirme se a API de produção está ligada;
4. Verifique CPF e senha;
5. Gere o APK com o perfil `apk-producao`, não com uma configuração local antiga.

### Preciso deixar a API no meu computador ligada?

Não. O APK de produção usa a API publicada em HTTPS. O computador só é necessário para iniciar a compilação e baixar o arquivo pronto.
