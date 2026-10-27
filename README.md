# Ranking de Filmes

Sistema pessoal de avaliação de filmes para dois perfis (Mik e Vit), em React 18 + Vite.
Os dados ficam no back-end — o front consome a API via `VITE_API_URL`.

## Pré-requisito: back-end rodando

Este front **não funciona sozinho**. É preciso ter a API no ar (por padrão em `http://localhost:3000`), com as rotas:

- `POST /api/login` → `{ token, perfil }`
- `GET /api/filmes?perfil=mik|vit`
- `GET /api/filmes/:id`
- `POST /api/filmes`
- `PUT /api/filmes/:id`
- `DELETE /api/filmes/:id`

As rotas de filmes exigem o header `Authorization: Bearer <token>`.
O back-end precisa liberar CORS para a origem do front (`http://localhost:5173` em desenvolvimento).

## Rodar em desenvolvimento

```bash
npm install
cp .env.example .env.local   # ajuste VITE_API_URL se o back não estiver na porta 3000
npm run dev
```

O front sobe em `http://localhost:5173`.

## Build

```bash
npm run build     # gera dist/
npm run preview   # serve o build local
```

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: Vite; build `npm run build`, output `dist`).
2. Em **Settings → Environment Variables**, crie `VITE_API_URL` com a URL pública da API
   (ex.: `https://sua-api.onrender.com`) — nos ambientes Production, Preview e Development.
3. Faça um novo deploy: variáveis `VITE_*` são embutidas no build, então mudar a variável
   exige **redeploy** para ter efeito.
4. No back-end, libere CORS para o domínio da Vercel.

> As variáveis `VITE_*` ficam visíveis no bundle do navegador. Nunca coloque segredos ali —
> só a URL pública da API.

## Trocar senhas

As senhas **não ficam neste repositório** — o front só envia o que foi digitado para
`POST /api/login` e o back-end valida. Não existe senha em `src/data.js` nem em nenhum
arquivo do front.

Para alterar, mexa nas variáveis de ambiente do **back-end**:

- `MIK_PASSWORD_HASH` — hash da senha do perfil Mik
- `VIT_PASSWORD_HASH` — hash da senha do perfil Vit

São hashes, não as senhas em texto puro. O jeito de gerar o hash e onde definir essas
variáveis (local e em produção) estão documentados no **README do back-end** — siga de lá.
Depois de trocar, reinicie/redeploy o back; o front não precisa de mudança nem de novo build.

## Estrutura

- `src/api.js` — cliente da API (login, token no localStorage, CRUD de filmes)
- `src/data.js` — perfis, critérios, cálculo da nota (prévia), formatação e ordenação do ranking
- `src/components/` — Button, ProfileCard, ScoreBadge, RankingItem, CriterionRating, ConfirmModal, EmptyState, TopBar, Icons
- `src/screens/` — Login, Ranking, Cadastro/Edição, Detalhe
- `src/styles.css` — tokens (cores, raios) e estilos

## Nota final

`gostei × 0,50 + soma dos outros 10 critérios × 0,05` (1,00 a 5,00).
O front mostra a nota em tempo real apenas como prévia; o valor oficial é o que a API devolve.

## Ordenação do ranking

Nota (desc) → `gostei` (desc) → nome (A→Z, pt-BR).

## Sessão

O token e o perfil logado ficam no `localStorage` (chave `ranking-de-filmes:auth`), então
recarregar a página mantém o login. Se a API responder `401`, a sessão é limpa e o app
volta para a tela de login.
