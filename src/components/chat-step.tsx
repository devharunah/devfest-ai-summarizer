"use client";

import { useChat } from "@ai-sdk/react";
import { type FormEvent, useState } from "react";
import Markdown from "react-markdown";

import { Button, ErrorNote, Panel, Spinner } from "./panel";

const SUGGESTIONS = [
  "What decisions were made?",
  "Who owns the offline sync fix, and by when?",
  "Why are they moving off the Python service?",
  "What did they say about pricing for farmers?",
];

export function ChatStep({ document, code }: { document: string; code: string }) {
  const { messages, sendMessage, status, error, stop, setMessages } = useChat();
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";
  const disabled = !document.trim();

  function ask(text: string) {
    if (!text.trim() || busy || disabled) return;
    // The document travels with every request. The model has no memory between calls.
    void sendMessage({ text }, { body: { document } });
    setInput("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    ask(input);
  }

  return (
    <Panel
      step={4}
      title="Ask follow-up questions"
      concept="useChat() + streamText()"
      description="A chat grounded in the document. The document goes in as instructions (model context) and useChat sends the full history on every turn."
      code={code}
      codePath="src/app/api/chat/route.ts"
      actions={
        <>
          {SUGGESTIONS.map((s) => (
            <Button key={s} variant="ghost" onClick={() => ask(s)} disabled={busy || disabled}>
              {s}
            </Button>
          ))}
          {messages.length ? (
            <Button variant="ghost" onClick={() => setMessages([])} disabled={busy}>
              Clear chat
            </Button>
          ) : null}
        </>
      }
    >
      <div className="space-y-3">
        {messages.length ? (
          <ol className="space-y-3">
            {messages.map((message) => (
              <li
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--accent)] px-3.5 py-2 text-sm text-white"
                    : "markdown max-w-[95%] rounded-2xl rounded-bl-sm bg-[var(--chip)] px-3.5 py-2 text-sm"
                }
              >
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <Markdown key={`${message.id}-${i}`}>{part.text}</Markdown>
                  ) : null,
                )}
              </li>
            ))}
          </ol>
        ) : null}
        {status === "submitted" ? (
          <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <Spinner /> Reading the document…
          </p>
        ) : null}
        {error ? <ErrorNote message={error.message} /> : null}

        <form onSubmit={onSubmit} className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Ask a question about the document
          </label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder={disabled ? "Paste a document first" : "Ask anything about the document…"}
            disabled={disabled}
            className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-transparent px-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          {busy ? (
            <Button variant="ghost" onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={disabled || !input.trim()}>
              Ask
            </Button>
          )}
        </form>
      </div>
    </Panel>
  );
}
