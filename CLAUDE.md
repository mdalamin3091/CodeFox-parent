# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

```
CodeFox/
├── frontend/       # Next.js 16 app (port 3000)
└── codefox-api/    # Express API (port 4000)
```

## Development Commands

### Frontend (`frontend/`)
```bash
npm run dev       # Start dev server on :3000
npm run build     # Production build
npm run lint      # ESLint
```

### API (`codefox-api/`)
```bash
npm run dev             # tsx watch src/server.ts (no build step)
npm run prisma:migrate  # Run DB migrations
npm run prisma:generate # Regenerate Prisma client
```

There are no automated tests in this codebase.

## Architecture

### Request Flow
1. Browser → `http://localhost:3000` (Next.js)
2. Frontend proxies `/api/*` → `http://localhost:4000/api/*` via `next.config.ts` rewrites (enables same-origin cookies)
3. `better-auth.session_token` cookie set by backend, read by `frontend/middleware.ts` for route protection

### Authentication (better-auth)
- **Critical ordering in `codefox-api/src/app.ts`**: better-auth handler is mounted at `/api/auth/*` **before** `express.json()`. Never move this.
- Auth config: `codefox-api/src/lib/auth.ts` — GitHub OAuth, Prisma adapter, trustedOrigins
- Auth middleware: `codefox-api/src/middlewares/auth.middleware.ts` — calls `auth.api.getSession()`
- Frontend auth client: `frontend/lib/auth-client.ts` — `authClient.useSession()` in components

### Database (Prisma v7 + Neon PostgreSQL)
- Prisma config: `codefox-api/prisma.config.ts` (Prisma v7 pattern — do not use legacy `schema.prisma` datasource)
- Prisma singleton: `codefox-api/src/config/prisma.ts` (uses PrismaPg adapter)
- Schema: `codefox-api/prisma/schema.prisma`
- **better-auth tables** (managed by auth): `user`, `session`, `account`, `verification`
- **App tables**: `repository` (+ `connected`, `webhookId`, `webhookSecret`, `embeddingStatus`), `pull_request` (+ `analysisStatus`, `reviewStatus`)

### Module Pattern (`codefox-api/src/modules/`)
Each feature module has: `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.schema.ts` (Zod). Routes are mounted in `src/routes/index.ts`.

### Webhook System
- `POST /api/repos/:id/connect` installs a GitHub webhook and triggers the embedding queue
- `POST /api/webhooks/github` is a **public** route — verifies HMAC-SHA256 per-repo secret using `req.rawBody` (preserved via `express.json({ verify })`)
- Requires `WEBHOOK_BASE_URL` env var (ngrok URL for local dev)

### Embedding Pipeline
- `codefox-api/src/modules/embedding/embedding.queue.ts` — BullMQ singleton, concurrency=1
- Triggered on repo connect; fetches GitHub file tree → filters → embeds via Google AI `gemini-embedding-001` (default dimension=3072) → upserts to Pinecone namespace (namespace = repoId)
- Status tracked in `Repository.embeddingStatus`: `pending | processing | completed | failed`
- Frontend polls every 5s while any repo has status `pending` or `processing`
- **Google AI SDK**: `@google/genai` — `new GoogleGenAI({ apiKey }).models.embedContent({ model: 'gemini-embedding-001', contents })`. Pinecone index must match its output dimension (3072), NOT 768.
- **Pinecone SDK v7**: `pc.index({ name })`, then `index.namespace(ns).upsert({ records: [...] })`
- **Resumable** (for large repos on free-tier Gemini quota): vector IDs are path-based (`${repoId}:${path}`). On each run, `fetchExistingIds` (Pinecone `fetch`) skips files already embedded — checked BEFORE blob download, so a resume only re-fetches what's left. Embed+upsert is incremental (per `EMBED_BATCH`) so progress survives a crash/quota stop. `INTER_BATCH_DELAY` (1.5s) paces under per-minute RPM. On sustained 429 the job throws `QuotaExhaustedError` → marks `failed` with a resumable message (partial vectors kept), instead of wiping. No unconditional `deleteAll` in the embed path — disconnect (`keepContext=false`) is what clears a namespace.
- **Retry/resume endpoint**: `POST /api/repos/:id/embed` (`retryEmbedding`) re-enqueues a `failed`/`pending` connected repo; skip-existing means it picks up where it stopped. Note: no frontend trigger yet (backend-only). Throttle/resume only helps RPM exhaustion — a hard daily cap (RPD) still needs waiting across days or paid tier.

### PR Review Pipeline
- On webhook PR event: `analyzePrDiff(prId)` → `generatePrReview(prId)` (fire-and-forget, see `webhook.service.ts`)
- `analyzePrDiff` (`embedding.service.ts`) — embeds the PR diff, queries Pinecone (topK=10, score > 0.4), stores matched paths+scores in `PullRequest.relevantFiles`
- `generatePrReview` (`review.service.ts`) — uses `gemini-2.5-flash`. Reads `relevantFiles`, excludes files already in the diff, fetches the top `MAX_CONTEXT_FILES` (5) contents from GitHub at `headSha`, and injects them as read-only RAG context into each chunk's review prompt. Pinecone metadata stores only `filePath` (no content), so contents are re-fetched from GitHub
- Posts a GitHub review (inline comments + summary); falls back from APPROVE→COMMENT on own-PR 422

### ESM Setup (codefox-api)
- `"type": "module"` in package.json — better-auth is ESM-only
- tsconfig: `"module": "ESNext"`, `"moduleResolution": "bundler"`
- Use `tsx` directly; no build step needed to run

## Key Environment Variables

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_APP_URL` — backend URL, default `http://localhost:4000`
- `API_URL` — used by Server Components only (bypasses Next.js proxy), default `http://localhost:4000`

### API (`codefox-api/.env`)
- `PORT` — default 4000
- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` — min 32 chars
- `BETTER_AUTH_URL` — frontend URL (`http://localhost:3000`)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth App
- `WEBHOOK_BASE_URL` — public URL for webhook callbacks (ngrok for local dev)
- `GOOGLE_AI_API_KEY` — for embeddings
- `PINECONE_API_KEY`, `PINECONE_INDEX` — Pinecone vector store (`codefox`, dimension=3072 to match `gemini-embedding-001`)
- `GOOGLE_AI_API_KEY` — also used for AI review (`review.service.ts` uses `gemini-2.5-flash` via `@google/genai`, NOT OpenRouter)
- `OPEN_ROUTER_API_KEY` — declared in env but currently unused by `review.service.ts` (review runs on Gemini)

### GitHub OAuth App
Callback URL must be: `http://localhost:3000/api/auth/callback/github`

## Frontend Architecture

### Composition Root Pattern
Pages are thin orchestration layers. Business logic, API calls, and UI live inside feature modules. **Never import from one feature into another.**

```
frontend/
├── app/                          # Next.js App Router pages (Composition Roots)
│   ├── dashboard/
│   │   ├── _components/          # Co-located client components for this route
│   │   │   └── DashboardGreeting.tsx
│   │   ├── error.tsx
│   │   └── page.tsx              # Server Component — prefetches + HydrationBoundary
│   ├── repos/
│   │   ├── _components/
│   │   │   └── ReposPageClient.tsx
│   │   ├── error.tsx
│   │   └── page.tsx
│   └── repos/[id]/
│       ├── _components/
│       │   └── RepoDetailClient.tsx
│       ├── error.tsx
│       ├── page.tsx
│       └── pulls/[number]/
│           ├── _components/
│           │   └── PRReviewClient.tsx
│           ├── error.tsx
│           └── page.tsx
├── features/                     # Feature modules (isolated, no cross-imports)
│   ├── repos/
│   │   ├── api.ts                # Client-side fetch functions
│   │   ├── types.ts
│   │   ├── hooks/                # useQuery hooks
│   │   ├── components/           # UI components
│   │   └── index.ts              # Barrel export
│   ├── pull-requests/
│   ├── dashboard/
│   └── auth/
├── shared/                       # Shared across features (no feature imports)
│   └── components/
│       ├── layout/               # app-shell, sidebar, header, mobile-nav, theme-toggle
│       ├── providers.tsx         # QueryClientProvider + ThemeProvider
│       └── user-menu.tsx
└── lib/
    ├── get-query-client.ts       # React cache()-based server QueryClient factory
    ├── query-keys.ts             # Centralised query key constants
    ├── api/
    │   └── server.ts             # Authenticated server-side fetch (Server Components only)
    └── auth-client.ts
```

### Import Rules
- `pages → features ✅` — pages import from features
- `features → shared ✅` — features may use shared components
- `features → features ❌` — never cross-import between features
- `pages → shared ✅` — pages may use shared components directly

### React Query SSR (Streaming)
All data-fetching pages use the **Streaming SSR** pattern with `useSuspenseQuery`:

1. **Server Component** (`page.tsx`) — `void prefetchQuery(...)` (non-blocking), wraps client in `<HydrationBoundary>` + `<Suspense fallback={<Skeleton />}>`
2. **Client Component** (`_components/*Client.tsx`) — `useSuspenseQuery` instead of `useQuery`; `data` is always defined, no `isLoading` check needed
3. **Skeleton** — defined inline in `page.tsx` as the `<Suspense>` fallback

Key files:
- `lib/get-query-client.ts` — `cache(() => new QueryClient(...))` with `shouldDehydrateQuery` that includes `pending` status (required for streaming)
- `lib/query-keys.ts` — single source of truth for query keys; server prefetches and client hooks **must use identical keys**
- `lib/api/server.ts` — server-side fetch that forwards `better-auth.session_token` cookie and uses `API_URL` (absolute URL); never use relative `/api/` paths in Server Components

**Critical:** Do NOT use `await prefetchQuery` in pages — use `void` so HTML streams immediately. The `shouldDehydrateQuery` option in `getQueryClient` includes `pending` queries in the dehydrated state, allowing the client `<Suspense>` to resolve when the stream arrives.

**Critical:** `lib/query-client.ts` has been deleted. Do not recreate it. The old module-level singleton caused cross-user data leaks in SSR. Use `lib/get-query-client.ts` (server) or `useState(() => new QueryClient())` in `Providers` (client).

### Polling / Real-time Updates
Hooks use `refetchInterval` to poll while async jobs are in progress:
- Embedding status (`pending | processing`) — repos list and repo detail poll every 5s
- Review status (`processing`) — PR list polls every 5s
`useSuspenseQuery` supports `refetchInterval` the same as `useQuery`.

### UI
- shadcn (new-york theme, neutral color) + Tailwind v4
- Add shadcn components via `npx shadcn@latest add <component>`
- Layout: `shared/components/layout/app-shell.tsx` wraps dashboard/repo routes with sidebar + header
- Landing page uses `shared/components/layout/navbar.tsx` (not app-shell)
- BigInt values from API must be serialized — `codefox-api/src/server.ts` patches `BigInt.prototype.toJSON`

### Routing
- Protected routes: `/dashboard`, `/repos/**` — redirect to `/login` if no session cookie
- Auth route: `/login` — redirect to `/dashboard` if already authenticated
- Middleware: `frontend/middleware.ts` reads `better-auth.session_token` cookie
