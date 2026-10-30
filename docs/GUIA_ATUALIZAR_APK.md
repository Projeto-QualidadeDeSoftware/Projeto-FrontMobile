# Como atualizar o APK do Prontê para 1.0.1

Este roteiro mantém o mesmo aplicativo, a mesma assinatura e os mesmos dados da API. A versão 1.0.1 corrige o recorte do logotipo na tela de abertura.

## O que muda

- Versão visível: `1.0.0` → `1.0.1`;
- Código Android: `1` → `2`;
- Identificador preservado: `br.com.pronte.mobile`;
- Nova imagem de abertura: `assets/pronte-splash.png`;
- Mesma API de produção;
- Mesmo projeto e mesma keystore do EAS.

## 1. Descobrir o projeto usado na primeira compilação

Abra o terminal na pasta antiga `Pronte-Mobile-v1.0.0` e execute:

```powershell
$env:EAS_NO_VCS = "1"
eas.cmd project:info
```

Anote o **Project ID** e o **Owner** exibidos. Eles identificam o projeto que guarda a assinatura da versão instalada.

## 2. Abrir a versão 1.0.1

1. Extraia `Pronte-Mobile-v1.0.1.zip`;
2. No VS Code, clique em **File → Open Folder**;
3. Selecione `Pronte-Mobile-v1.0.1`;
4. Clique em **Terminal → New Terminal**;
5. Instale as dependências:

```powershell
npm.cmd install
```

## 3. Vincular ao mesmo projeto EAS

Na pasta da versão 1.0.1, execute, trocando o trecho final pelo Project ID anotado:

```powershell
$env:EAS_NO_VCS = "1"
eas.cmd init --id COLE_AQUI_O_PROJECT_ID
```

Confira:

```powershell
eas.cmd project:info
```

O Project ID e o Owner precisam ser iguais aos da versão 1.0.0.

## 4. Validar e gerar o APK novo

Execute:

```powershell
npm.cmd run check
npm.cmd run doctor
eas.cmd build --platform android --profile apk-producao
```

O EAS deve reutilizar a keystore que já está guardada no projeto. Se ele perguntar se deve **gerar uma nova keystore**, interrompa o processo e confira o Project ID: uma nova assinatura impediria a atualização sobre o aplicativo instalado.

## 5. Baixar e instalar

Cada compilação gera um novo registro e um novo link. O link anterior continua apontando para o APK 1.0.0; ele não é substituído automaticamente.

Quando a nova compilação terminar:

1. Abra o novo link;
2. Baixe o APK;
3. Renomeie para `Pronte-Mobile-1.0.1.apk`;
4. Abra o arquivo no celular;
5. O Android deverá oferecer **Atualizar**, em vez de instalar outro aplicativo.

Como o identificador foi mantido, o código da versão aumentou e a assinatura é a mesma, o APK 1.0.1 atualiza a instalação existente.

## Se aparecer “Aplicativo não instalado”

Confira:

- Se o APK novo foi compilado no mesmo Project ID;
- Se o EAS reutilizou a keystore antiga;
- Se a versão exibida no build é `1.0.1 (2)`;
- Se o identificador continua `br.com.pronte.mobile`.

Não desinstale imediatamente a versão anterior. Primeiro confira a assinatura, pois uma atualização correta deve ser instalada por cima dela.

## Sobre os avisos de segurança

O APK é instalado fora da Play Store. Por isso, o navegador, o sistema Android e o Google Play Protect podem apresentar avisos separados durante o download e a instalação.

A assinatura criada pelo EAS protege a identidade técnica do pacote e permite atualizações, mas não transforma a equipe automaticamente em uma desenvolvedora verificada pelo Google.

Para a entrega acadêmica, compartilhe o link oficial do EAS e o hash SHA-256 do APK. Não é recomendado desativar o Play Protect permanentemente.
