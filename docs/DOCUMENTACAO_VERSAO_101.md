# Documentação da versão 1.0.1

## Correção da tela de abertura

O Android 12 e versões mais recentes aplicam uma máscara circular à imagem central da tela nativa de abertura. Como o arquivo anterior utilizava diretamente o logotipo horizontal, suas extremidades podiam ficar fora da área segura e ser cortadas em alguns aparelhos.

Foi criado o arquivo `assets/pronte-splash.png` com uma tela quadrada transparente e o logotipo centralizado dentro da área segura. A identidade visual foi preservada, mas agora existe margem suficiente ao redor da marca para acomodar o recorte aplicado pelo Android.

O `app.json` passou a usar:

```json
{
  "image": "./assets/pronte-splash.png",
  "imageWidth": 288,
  "resizeMode": "contain"
}
```

## Versionamento Android

- Versão pública: `1.0.1`;
- Código Android: `2`;
- Identificador mantido: `br.com.pronte.mobile`.

O identificador foi preservado para que o novo APK seja reconhecido como atualização. O `versionCode` foi aumentado porque o Android exige um código interno superior ao da versão já instalada.

Para atualizar sem desinstalar o aplicativo, o APK 1.0.1 precisa ser compilado no mesmo projeto EAS e assinado com a mesma keystore utilizada na versão 1.0.0.
