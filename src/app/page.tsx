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
const CHIP_COLORS = [
  "var(--pastel-blue)",
  "var(--pastel-red)",
  "var(--pastel-yellow)",
  "var(--pastel-green)",
];

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
        <p className="flex items-center gap-3 text-base text-[var(--ink)]">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-5 -rotate-45 rounded-full bg-[var(--google-red)]" />
            <span className="h-3 w-5 rotate-45 rounded-full bg-[var(--google-blue)]" />
            <span className="h-3 w-5 rotate-45 rounded-full bg-[var(--google-green)]" />
            <span className="h-3 w-5 -rotate-45 rounded-full bg-[var(--google-yellow)]" />
          </span>
          <span>
            Google Developer Groups <span className="text-[var(--muted)]">· DevFest Mbarara</span>
          </span>
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
          You don&apos;t need the <span className="text-[var(--google-blue)]">Python</span> backend.
        </h1>
        <p className="subhead mt-4 text-lg text-[var(--muted)] sm:text-xl">
          Shipping AI apps with Next.js and the AI SDK
        </p>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          Paste a long document, then walk through four AI SDK building blocks: a one-shot answer, a
          streamed summary, typed structured output, and a chat grounded in your document. All of it
          runs in one Next.js app.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {STACK.map((item, i) => (
            <li
              key={item}
              className="subhead rounded-full px-3 py-1 text-xs text-[var(--ink)]"
              style={{ backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] }}
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
