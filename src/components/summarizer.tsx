"use client";

import { useState } from "react";

import { MAX_DOCUMENT_CHARS, countWords } from "@/lib/ai/prompts";
import { SAMPLE_TRANSCRIPT } from "@/lib/sample-transcript";

import { ChatStep } from "./chat-step";
import { InsightsStep } from "./insights-step";
import { Button } from "./panel";
import { StreamStep } from "./stream-step";
import { TldrStep } from "./tldr-step";

export type Snippets = { tldr: string; stream: string; insights: string; chat: string };

export function Summarizer({ snippets }: { snippets: Snippets }) {
  const [document, setDocument] = useState("");
  // Bumped when the document is replaced wholesale, which remounts the steps and clears their output.
  const [version, setVersion] = useState(0);

  function replace(text: string) {
    setDocument(text);
    setVersion((v) => v + 1);
  }

  const words = countWords(document);
  const tooLong = document.length > MAX_DOCUMENT_CHARS;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section
        aria-labelledby="document-heading"
        className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-6 lg:sticky lg:top-6 lg:self-start"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="document-heading" className="text-xl font-bold tracking-tight">
            Your document
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => replace(SAMPLE_TRANSCRIPT)}>
              Load sample transcript
            </Button>
            {document ? (
              <Button variant="ghost" onClick={() => replace("")}>
                Clear
              </Button>
            ) : null}
          </div>
        </div>
        <label htmlFor="document" className="sr-only">
          Document to summarize
        </label>
        <textarea
          id="document"
          value={document}
          onChange={(e) => setDocument(e.currentTarget.value)}
          placeholder="Paste meeting notes, a transcript, an article, a contract…"
          className="mt-4 h-[50vh] w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--off-white)]/50 p-4 text-[14px] leading-6 outline-none focus:border-[var(--accent)] focus:bg-white lg:h-[60vh]"
        />
        <p
          className={`subhead mt-2 text-xs ${tooLong ? "text-[var(--danger)]" : "text-[var(--muted)]"}`}
          data-testid="word-count"
        >
          {words.toLocaleString()} words · {document.length.toLocaleString()} /{" "}
          {MAX_DOCUMENT_CHARS.toLocaleString()} characters
        </p>
      </section>

      <div key={version} className="space-y-6">
        <TldrStep document={document} code={snippets.tldr} />
        <StreamStep document={document} code={snippets.stream} />
        <InsightsStep document={document} code={snippets.insights} />
        <ChatStep document={document} code={snippets.chat} />
      </div>
    </div>
  );
}
