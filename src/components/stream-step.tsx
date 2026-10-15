"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";
import Markdown from "react-markdown";

import { compressionRatio, countWords } from "@/lib/ai/prompts";

import { Button, ErrorNote, Panel, Spinner, Stat } from "./panel";

export function StreamStep({ document, code }: { document: string; code: string }) {
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [firstTokenMs, setFirstTokenMs] = useState<number | null>(null);

  // Times the raw stream: when the first chunk arrives, and when the last one does.
  const timedFetch: typeof fetch = async (input, init) => {
    const started = Date.now();
    const response = await fetch(input, init);
    if (!response.body) return response;

    let first = true;
    const body = response.body.pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          if (first) {
            first = false;
            setFirstTokenMs(Date.now() - started);
          }
          controller.enqueue(chunk);
        },
        flush() {
          setElapsed(Date.now() - started);
        },
      }),
    );

    return new Response(body, response);
  };

  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: "/api/summarize",
    streamProtocol: "text",
    fetch: timedFetch,
  });

  function run() {
    setElapsed(null);
    setFirstTokenMs(null);
    void complete(document);
  }

  const inputWords = countWords(document);
  const outputWords = countWords(completion);
  const ratio = compressionRatio(inputWords, outputWords);

  return (
    <Panel
      step={2}
      title="Streaming summary"
      concept="streamText() + useCompletion()"
      description="Same model, but the route handler streams tokens as they are generated. The first words land in well under a second."
      code={code}
      codePath="src/app/api/summarize/route.ts"
      actions={
        <>
          <Button onClick={run} disabled={isLoading || !document.trim()}>
            {isLoading ? <Spinner /> : null} {isLoading ? "Streaming…" : "Stream summary"}
          </Button>
          {isLoading ? (
            <Button variant="ghost" onClick={stop}>
              Stop
            </Button>
          ) : null}
        </>
      }
    >
      {error ? <ErrorNote message={error.message} /> : null}
      {completion ? (
        <div className="space-y-3">
          <div className="markdown">
            <Markdown>{completion}</Markdown>
          </div>
          <div className="flex flex-wrap gap-2">
            <Stat label="words" value={`${inputWords.toLocaleString()} → ${outputWords}`} />
            {ratio ? <Stat label="compression" value={ratio} /> : null}
            {firstTokenMs !== null ? (
              <Stat label="first token" value={`${(firstTokenMs / 1000).toFixed(1)}s`} />
            ) : null}
            {elapsed !== null ? (
              <Stat label="total" value={`${(elapsed / 1000).toFixed(1)}s`} />
            ) : null}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
