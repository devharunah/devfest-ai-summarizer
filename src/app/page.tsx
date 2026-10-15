import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type Snippets, Summarizer } from "@/components/summarizer";

// Read at build time, so "Show the code" always shows the code that actually runs.
export const dynamic = "force-static";

function source(path: string): string {
  // The page is prerendered, so these files are only read at build time and need no tracing.
  return readFileSync(join(/*turbopackIgnore: true*/ process.cwd(), path), "utf8").trim();
}

const STACK = ["Next.js 16", "AI SDK", "OpenAI", "Zod", "TypeScript"];

export default function Home() {
  const snippets: Snippets = {
    tldr: source("src/app/actions.ts"),
    stream: source("src/app/api/summarize/route.ts"),
    insights: `${source("src/lib/ai/schemas.ts")}\n\n// ───── src/app/api/extract/route.ts ─────\n\n${source("src/app/api/extract/route.ts")}`,
    chat: source("src/app/api/chat/route.ts"),
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-10 max-w-3xl">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="flex gap-1" aria-hidden>
            <span className="size-2 rounded-full bg-[#4285F4]" />
            <span className="size-2 rounded-full bg-[#EA4335]" />
            <span className="size-2 rounded-full bg-[#FBBC04]" />
            <span className="size-2 rounded-full bg-[#34A853]" />
          </span>
          DevFest Mbarara
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          You don&apos;t need the Python backend.
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          Paste a long document, then walk through four AI SDK building blocks: a one-shot answer, a
          streamed summary, typed structured output, and a chat grounded in your document. All of it
          runs in one Next.js app.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {STACK.map((item) => (
            <li
              key={item}
              className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      </header>

      <Summarizer snippets={snippets} />

      <footer className="mt-12 text-sm text-[var(--muted)]">
        Source on{" "}
        <a
          className="underline underline-offset-4 hover:text-[var(--ink)]"
          href="https://github.com/devharunah/devfest-ai-summarizer"
        >
          GitHub
        </a>
        . Built with Next.js and the Vercel AI SDK.
      </footer>
    </main>
  );
}
