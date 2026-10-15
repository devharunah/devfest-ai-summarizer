"use client";

import { useState, useTransition } from "react";

import { type TldrResult, quickTldr } from "@/app/actions";

import { Button, ErrorNote, Panel, Spinner, Stat } from "./panel";

export function TldrStep({ document, code }: { document: string; code: string }) {
  const [result, setResult] = useState<TldrResult | null>(null);
  const [pending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      setResult(await quickTldr(document));
    });
  }

  return (
    <Panel
      step={1}
      title="Quick TL;DR"
      concept="generateText()"
      description="One request, one complete answer. Called from a Server Action, so there is no API route at all. You wait for the whole thing."
      code={code}
      codePath="src/app/actions.ts"
      actions={
        <Button onClick={run} disabled={pending || !document.trim()}>
          {pending ? <Spinner /> : null} {pending ? "Thinking…" : "Get TL;DR"}
        </Button>
      }
    >
      {result?.ok === false ? <ErrorNote message={result.error} /> : null}
      {result?.ok ? (
        <div className="space-y-3">
          <p className="text-[15px] leading-7">{result.text}</p>
          <div className="flex flex-wrap gap-2">
            <Stat label="model" value={result.model} />
            <Stat label="latency" value={`${(result.ms / 1000).toFixed(1)}s`} />
            <Stat label="tokens in" value={String(result.inputTokens ?? "?")} />
            <Stat label="tokens out" value={String(result.outputTokens ?? "?")} />
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
