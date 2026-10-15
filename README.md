# claude-nextjs-supabase-template

A Next.js 16 and Supabase starter that arrives with a working Claude Code setup: nine subagents,
fifteen slash commands, ten skills, standing rules, and session hooks that survive compaction.

Use it as a GitHub template, or `gh repo create <name> --template devharunah/claude-nextjs-supabase-template`.

## What you get

**The app**

- Next.js 16, App Router, React 19, TypeScript strict, plus the strictness flags `strict`
  itself leaves off, and typed routes and typed env vars from `next.config.ts`
- Tailwind CSS v4 through PostCSS
- Supabase through `@supabase/ssr`, a server client and a browser client, both behind `requireEnv`
- Biome for formatting and lint, ESLint for the Next rules
- Jest for pure modules, Playwright for anything that renders or fetches

**The CI**

Four jobs in `.github/workflows/ci.yml`, sharing one composite setup action: lint, typecheck plus
production build, unit tests, and E2E gated behind the other three. The Playwright report uploads
as an artifact on failure.

**The harness**

`.claude/`, vendored from [everything-claude-code](https://github.com/devharunah/everything-claude-code)
and adapted so it actually runs on this stack and on Windows. Read `.claude/README.md` for what
changed and why.

## Getting started

```bash
pnpm install
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then:

```bash
pnpm dev
```

## Then do these four things

1. Fill in the bracketed parts of `CLAUDE.md`. The file is the contract every Claude session reads
   first, and a template that still says `[Project name]` teaches it nothing.
2. Rename the project in `package.json`.
3. Add your Supabase secrets under Settings, Secrets and variables, Actions. The E2E job falls
   back to a local URL so it stays green until you do.
4. Decide your deploy target. `ci.yml` has a comment marking where the deploy steps attach.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on port 3000 |
| `pnpm verify` | lint, typecheck, Jest, Playwright. Run it before every push |
| `pnpm check` | Biome |
| `pnpm lint:fix` | ESLint and Biome, writing fixes |
| `pnpm test` | Jest |
| `pnpm e2e` | Playwright |
| `pnpm typecheck` | Regenerates route and env types, then runs `tsc --noEmit` |

## Credit

The Claude Code configuration is MIT licensed work by Affaan Mustafa, from
[everything-claude-code](https://github.com/affaan-m/everything-claude-code). The Next.js and
Supabase base follows `Aaron-Douglas/nextjs-supabase-starter`.
