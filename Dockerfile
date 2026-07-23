FROM node:22-alpine AS builder
ENV COREPACK_INTEGRITY_KEYS=0
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN grep -qs '^minimumReleaseAge:' pnpm-workspace.yaml || printf '\nminimumReleaseAge: 0\n' >> pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds
COPY . .
RUN grep -qs '^minimumReleaseAge:' pnpm-workspace.yaml || printf '\nminimumReleaseAge: 0\n' >> pnpm-workspace.yaml
RUN pnpm build

FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV COREPACK_INTEGRITY_KEYS=0
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

EXPOSE 8080
USER 1001
CMD ["node_modules/.bin/next", "start", "-p", "8080"]