# ConnoSr

ConnoSr é uma rede social de reviews de experiências (restaurantes, hotéis,
resorts, parques etc.) — como um Letterboxd, mas para lugares em vez de
filmes. Usuários escrevem reviews com nota e um carrossel de fotos, seguem
outros usuários e acompanham tudo em um feed.

## Estrutura do monorepo

```
apps/
  web/      React + TypeScript (Vite) — app web
  mobile/   React Native (Expo) — app mobile
  api/      Node.js (Fastify + Prisma) — backend
packages/
  shared-types/  Contrato de tipos/DTOs (Zod) compartilhado entre API e clientes
  api-client/    Cliente HTTP + hooks de React Query, usados por web e mobile
  ui/            Design tokens (cores, spacing, tipografia)
  config/        Configuração compartilhada de eslint/tsconfig
  utils/         Funções puras (rating, slugify, etc.)
infra/
  docker-compose.yml   Postgres + MinIO locais
```

## Setup local

Pré-requisitos: Node 22+, pnpm 10+, Docker.

```bash
pnpm install

# sobe Postgres + MinIO locais
docker compose -f infra/docker-compose.yml up -d

# configura variáveis de ambiente do backend
cp apps/api/.env.example apps/api/.env

# roda as migrations e popula dados de exemplo
pnpm --filter @connosr/api exec prisma migrate dev
pnpm db:seed

# desenvolvimento (todos os apps em paralelo)
pnpm dev
```

- Backend: http://localhost:3001 (health check em `/api/v1/health`)
- Web: http://localhost:5173
- Mobile: `pnpm --filter @connosr/mobile start` e abrir no Expo Go/simulador

Usuários de exemplo (seed): `alice@example.com` / `bruno@example.com`, senha
`password123`.

## Acessando pelo celular (mesma rede Wi-Fi)

O app web e o backend, por padrão, só ficam acessíveis no próprio computador
(`localhost`). Pra abrir no navegador do celular, ele precisa estar na
**mesma rede Wi-Fi** do computador e você precisa usar o **IP local do
computador**, não `localhost`:

1. Descubra o IP local do computador (ex: `192.168.1.42`):
   - macOS/Linux: `ipconfig getifaddr en0` (Wi-Fi) ou `hostname -I`
   - Windows: `ipconfig` (campo "Endereço IPv4")
2. Aponte o app web pra API usando esse IP em vez de `localhost`:
   ```bash
   echo "VITE_API_URL=http://SEU_IP_LOCAL:3001" > apps/web/.env
   ```
3. Permita esse IP no CORS do backend (`apps/api/.env`):
   ```
   WEB_ORIGIN=http://SEU_IP_LOCAL:5173
   ```
4. Suba os dois normalmente (`pnpm dev`) e, **no celular**, acesse:
   `http://SEU_IP_LOCAL:5173`

⚠️ Se ao acessar pelo celular aparecer um **JSON grande** em vez do app,
você provavelmente abriu a porta da **API (3001)** em vez da porta do
**app web (5173)** — confira a URL. Um firewall bloqueando a conexão
também é uma causa comum de não conseguir acessar de jeito nenhum.

Pra rodar o **app mobile** (não o web) no celular de verdade, use o Expo Go:
`pnpm --filter @connosr/mobile start` e escaneie o QR code — celular e
computador também precisam estar na mesma rede.

## Scripts úteis

- `pnpm lint` / `pnpm typecheck` / `pnpm build` / `pnpm test` — rodam em todos os apps/packages via Turborepo.
- `pnpm db:migrate` — cria uma nova migration do Prisma.
