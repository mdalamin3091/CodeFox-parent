# ---- deps ----
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ----
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time,
# so they must be passed as build args, not runtime env.
ARG NEXT_PUBLIC_APP_URL=http://localhost:4000
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# next.config.ts rewrites() is evaluated during `next build` and baked into
# .next/routes-manifest.json — API_URL must be present at BUILD time, not just runtime.
ARG API_URL=http://localhost:4000
ENV API_URL=$API_URL

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runner ----
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
