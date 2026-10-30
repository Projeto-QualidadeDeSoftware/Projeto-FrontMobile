# Documentação da versão 0.8.2

## Ajustes para celulares

- A tela de login agora se ajusta quando o teclado é aberto e rola até o campo de senha;
- O campo de senha recebeu um botão para mostrar ou ocultar o conteúdo digitado;
- A barra de navegação respeita a área segura inferior do aparelho, sem ficar atrás dos botões de sistema do Android;
- O aplicativo declara explicitamente que o teclado deve redimensionar o conteúdo no Android.

## Correção de proporção e responsividade

- O logo agora recebe largura e altura numéricas proporcionais, evitando a caixa invisível criada pelo navegador ao combinar porcentagem, largura máxima e proporção;
- O formulário de login tem largura máxima em telas grandes e permanece centralizado;
- A tela de login permite rolagem vertical, então os campos e botões continuam acessíveis em celulares menores ou com o teclado aberto;
- O logo da tela inicial usa o mesmo cálculo proporcional para manter o comportamento consistente no celular e na web.

## Identidade visual

O logotipo horizontal do Prontê foi preparado em PNG com fundo transparente a partir da identidade visual fornecida pela equipe.

O arquivo está em:

```text
assets/pronte-logo-horizontal.png
```

O logo é utilizado:

- Na apresentação da tela de login;
- No cabeçalho da tela inicial;
- Na tela de abertura configurada pelo Expo.

## Tela de configurações

A navegação inferior agora possui a opção **Ajustes**, que abre a tela **Configurações**.

Essa tela permite:

- Conferir o funcionário atualmente conectado;
- Identificar se o aplicativo está usando o servidor ou a demonstração local;
- Atualizar produtos, clientes, funcionários e vendas;
- Restaurar os dados iniciais do modo demonstração;
- Encerrar a sessão e voltar ao login;
- Consultar a versão do aplicativo.

O botão de saída foi retirado da área **Mais** e centralizado em **Configurações**, deixando cada função no lugar mais esperado pelo usuário.

## Organização

- `screens/Configuracoes.tsx`: composição e ações da nova tela;
- `components/Menu.tsx`: quinta opção da navegação inferior;
- `services/apiDemo.ts`: restauração dos dados de demonstração;
- `services/api.ts`: ligação entre a tela e o serviço utilizado;
- `App.tsx`: atualização, restauração e encerramento da sessão.
