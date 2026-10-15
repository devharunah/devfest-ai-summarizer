# devfest-ai-summarizer

**You Don't Need the Python Backend: shipping AI apps with Next.js and the AI SDK.**
The demo app for my DevFest Mbarara talk.

Paste a long document (or load the sample meeting transcript), then go through four steps. Each
step shows one AI SDK building block, and each panel has a **Show the code** toggle that displays
the exact server code behind it.

| Step | What you see | AI SDK concept | File |
|---|---|---|---|
| 1. Quick TL;DR | A two-sentence answer with latency and token counts | `generateText` in a Server Action | [`src/app/actions.ts`](src/app/actions.ts) |
| 2. Streaming summary | A Markdown summary that appears as the model writes it, plus the compression ratio | `streamText` + `useCompletion` | [`src/app/api/summarize/route.ts`](src/app/api/summarize/route.ts) |
| 3. Structured insights | Title, key points, decisions, action items with owners, sentiment. Cards fill in while the response streams | `Output.object` + a Zod schema + `useObject` | [`src/app/api/extract/route.ts`](src/app/api/extract/route.ts), [`src/lib/ai/schemas.ts`](src/lib/ai/schemas.ts) |
| 4. Follow-up questions | A chat that answers only from your document | `useChat` + `streamText`, with the document passed as `instructions` | [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) |

The server side is four small files plus a model helper. There's no FastAPI service, no second
deployment and no second language, and the API key never leaves the server.

## Run it

You need Node 20+, pnpm and an OpenAI API key.

```bash
pnpm install
cp .env.example .env.local   # then set OPENAI_API_KEY
pnpm dev
```

Open http://localhost:3000, click **Load sample transcript**, and go through steps 1 to 4.

| Variable | Required | Default |
|---|---|---|
| `OPENAI_API_KEY` | yes | none |
| `OPENAI_MODEL` | no | `gpt-5.4-mini` |

To use a different provider, change one file: [`src/lib/ai/model.ts`](src/lib/ai/model.ts). The
routes only call `getModel()`.

## Deploy

Import the repo on Vercel, add `OPENAI_API_KEY`, and deploy. Each route sets `maxDuration = 30`,
and responses stream, so long documents don't hit a blank timeout.

## Talking points

- **generateText vs streamText.** Both use the same model. Step 1 makes you wait for the whole answer; step 2 shows
  the first words in well under a second. Compare the `latency` and `first token` chips.
- **Structured output.** The Zod schema is shared by the server, where it constrains and validates
  the model's output, and the client, where it types the partial object for rendering. Use **Show raw JSON** to show the actual payload.
- **Model context.** The model keeps no memory between calls. `useChat` sends the whole history on
  every turn, and the route adds the document as `instructions`. Ask a question the document can't
  answer, such as the suggested pricing question, and the chat says so instead of making
  something up.
- **When you do still want Python:** offline data science, training, heavy notebooks. That work stays
  outside the request path, so the user-facing app doesn't need it.

## Project setup

Built from [`claude-nextjs-supabase-template`](https://github.com/devharunah/claude-nextjs-supabase-template),
with Supabase removed. It includes:

- **Claude Code harness** in `.claude/`: subagents, slash commands, skills, rules and hooks. See
  [`CLAUDE.md`](CLAUDE.md) and [`.claude/README.md`](.claude/README.md).
- **Strict TypeScript**, Biome and ESLint, Jest for pure modules, Playwright for the running app.
- **CI** on every PR: lint, typecheck plus production build, unit tests, then e2e. E2E never calls
  the model, so CI needs no API key.

```bash
pnpm verify   # lint + typecheck + jest + playwright
```

## License

MIT
