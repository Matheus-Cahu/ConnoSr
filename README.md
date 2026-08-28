# ConnoSr

ConnoSr é uma rede social de reviews de experiências (restaurantes, hotéis,
resorts, parques etc.) — como um Letterboxd. Usuários escrevem reviews com nota e um carrossel de fotos, seguem
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

## Scripts úteis

- `pnpm lint` / `pnpm typecheck` / `pnpm build` / `pnpm test` — rodam em todos os apps/packages via Turborepo.
- `pnpm db:migrate` — cria uma nova migration do Prisma.
