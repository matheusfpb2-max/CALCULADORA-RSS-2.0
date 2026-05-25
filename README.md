# CALCULADORA-RSS-2.0

Projeto Next.js (convertido para TypeScript) com calculadora ROK RSS pronta para deploy no Vercel.

Instalação local

1. Instale dependências:

```bash
npm install
```

2. Crie um arquivo `.env.local` ou configure variáveis no Vercel com as chaves do Firebase (use o arquivo `.env.local.example` como referência).

Variáveis necessárias (prefixadas com `NEXT_PUBLIC_`):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Executar em desenvolvimento:

```bash
npm run dev
```

Build para produção:

```bash
npm run build
npm start
```

Deploy no Vercel

1. Suba este repositório para o GitHub (ou conecte seu provedor suportado pelo Vercel).
2. No dashboard do Vercel, adicione o projeto e configure as mesmas variáveis de ambiente listadas acima.
3. Faça deploy — Vercel irá rodar `npm run build` automaticamente.

Observações

- O Firebase é inicializado apenas no cliente; os dados são salvos localmente como fallback e, quando o usuário está logado via Google, são sincronizados no Firestore.
- Se quiser TypeScript, posso converter o projeto.
 - O projeto já foi convertido para TypeScript. Arquivos `.ts`/`.tsx` e `tsconfig.json` foram adicionados.

TESTE
