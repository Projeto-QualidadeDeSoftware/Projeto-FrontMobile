# Documentação da versão 1.0.0

## Objetivo da versão

A versão 1.0.0 prepara o Prontê Mobile para ser entregue como APK Android instalável. O pacote de produção não depende do Expo Go, usa a API publicada e mantém desativado o modo demonstração.

## Identidade do aplicativo

- Nome exibido: **Prontê**;
- Identificador Android: `br.com.pronte.mobile`;
- Versão pública: `1.0.0`;
- Código Android: `1`;
- Orientação: retrato;
- Tema principal: claro.

Foram adicionados um ícone quadrado e um ícone adaptativo para o Android, ambos derivados da identidade visual do Prontê. A tela de abertura utiliza o logotipo horizontal em fundo creme.

## Perfis de compilação

O arquivo `eas.json` contém dois perfis:

| Perfil | API | Modo demonstração | Formato |
| --- | --- | --- | --- |
| `apk-producao` | Produção | Desativado | APK |
| `apk-homologacao` | Homologação | Desativado | APK |

O perfil de produção deve ser usado na entrega final. O perfil de homologação serve para validar mudanças antes da publicação.

## Configurações e privacidade

A tela de configurações foi organizada para o uso final:

- Identificação do funcionário conectado;
- Sincronização manual dos dados;
- Encerramento da sessão;
- Acesso às informações de privacidade e tratamento de dados;
- Exibição automática da versão instalada.

Informações técnicas sobre ambiente e desenvolvimento foram removidas da interface de produção. A restauração dos dados de demonstração continua disponível apenas quando o modo demonstração está ativo.

Foi criada a tela `screens/Privacidade.tsx`, com uma explicação acessível sobre dados pessoais, API, banco de dados e uso do assistente de IA.

## Validações executadas

- Verificação estática do TypeScript com `tsc --noEmit`;
- Diagnóstico do projeto com `expo-doctor`;
- Resultado do diagnóstico: **21 de 21 verificações aprovadas**;
- Exportação do bundle Android de produção;
- Confirmação das configurações públicas do Expo;
- Bundle Android gerado sem erros.

## Arquivos principais desta entrega

- `app.json`: identidade, versão e opções nativas do Android;
- `eas.json`: perfis de APK de produção e homologação;
- `package.json`: dependências, versão e comandos de compilação;
- `assets/pronte-icon.png`: ícone convencional;
- `assets/pronte-adaptive-icon.png`: primeiro plano do ícone adaptativo;
- `screens/Privacidade.tsx`: informações de privacidade;
- `GUIA_GERAR_APK.md`: roteiro completo de compilação e instalação.

## Limite desta entrega

O arquivo APK precisa ser assinado por uma conta Expo da equipe. Por segurança, o projeto não contém credenciais de conta nem a chave privada de assinatura. A primeira pessoa responsável pela compilação deve entrar no EAS e autorizar a geração da keystore, conforme o guia.
