# ZenBitTech Test Project

## How To Start

Prerequisites:

- Installed docker and docker compose
- Installed node v20
- Installed pnpm v8.8.0

Steps:

- Install dependencies: `pnpm install`
- Start Docker environment: `pnpm -w docker:up`
- Start api: `cd apps/api && pnpm start:dev`
- Start web: `cd apps/web && pnpm start:dev`
