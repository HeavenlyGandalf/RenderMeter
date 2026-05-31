# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RenderMeter benchmarks Node.js template engines (Handlebars, Mustache, Pug, EJS) side-by-side. Two modes: **Benchmark** (multi-engine comparison across 4 data-volume scenarios) and **Playground** (write a custom template, get a single timed render with HTML preview).

## Dev Commands

**MongoDB** (required before starting the server):
```bash
docker start mongo 2>/dev/null || docker run -d --name mongo -p 27017:27017 mongo:7
```

**Server** (`cd server`):
```bash
npm run dev       # ts-node-dev with hot reload → http://localhost:3001
npm run build     # tsc → dist/
npm start         # run compiled dist/server.js
```

**Client** (`cd client`):
```bash
npm run dev           # Vite dev server → http://localhost:5173
npm run build         # tsc + vite build
npm run typecheck     # tsc --noEmit only
npm run format        # prettier --write src/**/*.{ts,tsx,css}
npm run format:check  # prettier --check (used in CI-style checks)
```

There are no test suites — verify changes by running the app.

## Architecture

```
RenderMeter/
├── client/   # React 18 + Vite + TypeScript
└── server/   # Express 4 + TypeScript + Mongoose
```

### Server

The benchmark core lives in `server/src/services/benchmark.service.ts`. Flow:
1. Compile the template once per engine and record `compileMs`.
2. Warm up 10 renders (constant `WARMUP = 10`) so V8 JIT stabilises.
3. Run `runs` timed iterations with `performance.now()`.
4. Compute avg / median / min / max and persist to MongoDB (`BenchmarkRun` model).

`server/src/scenarios/` holds two files that must stay in sync:
- `data.ts` — four deterministic datasets (`simple` / `medium` / `heavy` / `extreme`).
- `templates.ts` — one template per engine that handles all four scenarios (departments field is optional).

Routes → Controllers (validate + call service) → Services (business logic) pattern. `render.service.ts` handles Playground single-renders (pug + ejs only, no warmup, returns HTML).

### Client

Feature-based structure under `client/src/features/`:
- `benchmark/` — main comparison page; TanStack Query caches results so navigating away and back doesn't re-fetch.
- `playground/` — Monaco Editor + engine selector + history list; calls `/api/render`.
- `docs/` — static documentation page.

Shared pieces in `client/src/shared/`: typed Axios instance (`api/axios.ts` with `baseURL: '/api'`), common types (`shared/types/index.ts`), engine/scenario constants.

i18n via `i18next` with three locales in `client/src/i18n/locales/` (ru, en, fr). Add new strings to all three files when touching UI text.

### API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/benchmark` | Run benchmark |
| GET | `/api/benchmark/history` | Last 10 runs |
| GET | `/api/benchmark/templates` | Templates per engine |
| GET | `/api/benchmark/scenarios` | All scenario datasets |
| POST | `/api/render` | Single render (Playground) |
| GET | `/api/results` | Playground history |
| GET | `/api/health` | Server health |

POST `/api/benchmark` body: `{ engines, scenarios, runs, customData }`. `customData` replaces the standard scenario data entirely when provided.

---

## Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
