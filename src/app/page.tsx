import { codeToHtml } from "shiki";

import { type Snippets, Summarizer } from "@/components/summarizer";
import { CHAT_SAMPLE, INSIGHTS_SAMPLE, STREAM_SAMPLE, TLDR_SAMPLE } from "@/lib/code-samples";

// Prerendered, so the samples are highlighted once at build time and no highlighter ships to the browser.
export const dynamic = "force-static";

function highlight(code: string): Promise<string> {
  return codeToHtml(code, { lang: "ts", theme: "one-dark-pro" });
}

const STACK = ["Next.js 16", "AI SDK", "OpenAI", "Zod", "TypeScript"];
const CHIP_COLORS = [
  "var(--pastel-blue)",
  "var(--pastel-red)",
  "var(--pastel-yellow)",
  "var(--pastel-green)",
];

export default async function Home() {
  const [tldr, stream, insights, chat] = await Promise.all(
    [TLDR_SAMPLE, STREAM_SAMPLE, INSIGHTS_SAMPLE, CHAT_SAMPLE].map(highlight),
  );
  const snippets: Snippets = {
    tldr: tldr ?? "",
    stream: stream ?? "",
    insights: insights ?? "",
    chat: chat ?? "",
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
