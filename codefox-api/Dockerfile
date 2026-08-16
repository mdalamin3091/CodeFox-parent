# ---------- builder: full deps, generate Prisma client ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma.config.ts ./
COPY prisma ./prisma

# prisma.config.ts reads DATABASE_URL when it loads; generate makes no DB connection
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate

# ---------- runner: prod deps only + generated client ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY tsconfig.json ./
COPY src ./src

# winston writes logs/error.log + logs/combined.log when NODE_ENV=production.
# /app is root-owned, so the `node` user needs this dir pre-created and chowned.
RUN mkdir -p /app/logs && chown -R node:node /app/logs

EXPOSE 4000

USER node

CMD ["npm", "start"]
