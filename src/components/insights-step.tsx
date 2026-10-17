"use client";

import { useObject } from "@ai-sdk/react";
import { useState } from "react";

import { insightsSchema } from "@/lib/ai/schemas";

import { Button, ErrorNote, Panel, Spinner } from "./panel";

const SENTIMENT_STYLES: Record<string, string> = {
  positive: "bg-[var(--pastel-green)]",
  neutral: "bg-[var(--off-white)]",
  mixed: "bg-[var(--pastel-yellow)]",
  negative: "bg-[var(--pastel-red)]",
};

export function InsightsStep({ document, code }: { document: string; code: string }) {
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/extract",
    schema: insightsSchema,
  });
  const [showJson, setShowJson] = useState(false);

  return (
    <Panel
      step={3}
      title="Structured insights"
      concept="Output.object() + Zod + useObject()"
      description="A Zod schema describes the shape we want. The model fills it in, the SDK validates it, and the partial object streams into typed UI cards."
      code={code}
      codePath="src/app/api/extract/route.ts"
      actions={
        <>
          <Button onClick={() => submit({ document })} disabled={isLoading || !document.trim()}>
            {isLoading ? <Spinner /> : null} {isLoading ? "Extracting…" : "Extract insights"}
          </Button>
          {isLoading ? (
            <Button variant="ghost" onClick={stop}>
              Stop
            </Button>
          ) : null}
          {object ? (
            <Button variant="ghost" onClick={() => setShowJson((v) => !v)}>
              {showJson ? "Show cards" : "Show raw JSON"}
            </Button>
          ) : null}
        </>
      }
    >
      {error ? <ErrorNote message={error.message} /> : null}
      {object && showJson ? (
        <pre className="max-h-96 overflow-auto rounded-xl bg-[var(--code-bg)] p-4 font-mono text-[12.5px] leading-5 text-[var(--code-ink)]">
          {JSON.stringify(object, null, 2)}
        </pre>
      ) : null}
      {object && !showJson ? (
        <div className="space-y-4">
          <div>
            {object.title ? <h3 className="text-base font-bold">{object.title}</h3> : null}
            {object.oneLiner ? (
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{object.oneLiner}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {object.sentiment ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${SENTIMENT_STYLES[object.sentiment] ?? ""}`}
                >
                  {object.sentiment}
                </span>
              ) : null}
              {object.topics?.map((topic, i) =>
                topic ? (
                  <span
                    key={`${i}-${topic}`}
                    className="subhead rounded-full bg-[var(--pastel-blue)] px-2 py-0.5 text-xs"
                  >
                    #{topic}
                  </span>
                ) : null,
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card title="Key points" items={object.keyPoints} />
            <Card title="Decisions" items={object.decisions} />
          </div>

          {object.actionItems?.length ? (
            <div className="rounded-xl border border-[var(--line)] p-4">
              <h4 className="text-sm font-bold">Action items</h4>
              <ul className="mt-2 divide-y divide-[var(--line)]">
                {object.actionItems.map((item, i) =>
                  item ? (
                    // biome-ignore lint/suspicious/noArrayIndexKey: streamed items only append, and their text changes mid-stream
                    <li key={i} className="flex items-start justify-between gap-3 py-2 text-sm">
                      <span className="leading-6">{item.task}</span>
                      {item.owner ? (
                        <span className="shrink-0 rounded-full bg-[var(--pastel-blue)] px-2.5 py-0.5 text-xs font-medium">
                          {item.owner}
                        </span>
                      ) : null}
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}

function Card({ title, items }: { title: string; items: (string | undefined)[] | undefined }) {
  return (
    <div className="rounded-xl border border-[var(--line)] p-4">
      <h4 className="text-sm font-bold">{title}</h4>
      {items?.length ? (
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6">
          {items.map((item, i) =>
            // biome-ignore lint/suspicious/noArrayIndexKey: streamed items only append, and their text changes mid-stream
            item ? <li key={i}>{item}</li> : null,
          )}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-[var(--muted)]">…</p>
      )}
    </div>
  );
}
