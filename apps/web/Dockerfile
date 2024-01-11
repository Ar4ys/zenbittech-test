
FROM node:20-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm
RUN pnpm add -g turbo

FROM base AS pruner
COPY . .
RUN turbo prune --scope="@repo/web" --docker

FROM base AS builder
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
RUN pnpm install

COPY --from=pruner /app/out/full/ .
WORKDIR /app/apps/web
RUN pnpm build

FROM builder AS runner
WORKDIR /app/apps/web

CMD pnpm start
