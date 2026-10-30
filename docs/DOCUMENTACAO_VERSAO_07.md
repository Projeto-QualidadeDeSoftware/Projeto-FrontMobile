# Documentação da versão 0.7

## Objetivo

Permitir que a equipe visualize e teste o aplicativo quando a API publicada estiver desligada ou indisponível.

## Modo demonstração

O modo demonstração substitui temporariamente as requisições HTTP por dados locais mantidos na memória. Ele oferece:

- Login sem CPF ou senha;
- Produtos, clientes, funcionários e vendas de exemplo;
- Cadastro, edição e exclusão de registros;
- Registro de vendas com atualização do estoque;
- Histórico de vendas;
- Resposta local para perguntas simples sobre estoque baixo.

As telas continuam chamando as mesmas funções de `services/api.ts`. Esse arquivo escolhe entre a API real e `services/apiDemo.ts` de acordo com a variável `EXPO_PUBLIC_MODO_DEMO`.

## Como ativar

No PowerShell:

```powershell
Copy-Item .env.demo.example .env
npx expo start -c
```

No Prompt de Comando:

```bat
copy .env.demo.example .env
npx expo start -c
```

Depois, clique em **Entrar sem servidor** na tela inicial.

## Como voltar para a API

Exclua o arquivo `.env` usado na demonstração e limpe o cache:

```powershell
Remove-Item .env
npx expo start -c
```

Sem `EXPO_PUBLIC_MODO_DEMO=true`, o aplicativo volta a usar a API de produção configurada em `services/api.ts`.

## Limitações

- Os dados locais não são gravados no MySQL;
- Os dados voltam ao estado inicial após um recarregamento completo;
- A resposta do assistente é simulada e não utiliza a Mistral;
- O modo demonstração deve permanecer desativado no pacote enviado à Play Store.
