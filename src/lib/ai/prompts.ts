export const MAX_DOCUMENT_CHARS = 60_000;

export type DocumentCheck = { ok: true; document: string } | { ok: false; error: string };

export function checkDocument(input: unknown): DocumentCheck {
  if (typeof input !== "string" || input.trim().length === 0) {
    return { ok: false, error: "Paste a document first." };
  }

  if (input.length > MAX_DOCUMENT_CHARS) {
    return {
      ok: false,
      error: `Document is too long (${input.length.toLocaleString()} characters). The limit is ${MAX_DOCUMENT_CHARS.toLocaleString()}.`,
    };
  }

  return { ok: true, document: input.trim() };
}

export function countWords(text: string): number {
  const trimmed = text.trim();

  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function compressionRatio(inputWords: number, outputWords: number): string | null {
  if (inputWords === 0 || outputWords === 0) {
    return null;
  }

  return `${Math.round(inputWords / outputWords)}x shorter`;
}

export function tldrPrompt(document: string): string {
  return `Summarize the document below in at most two sentences. Plain text, no preamble.

<document>
${document}
</document>`;
}

export function summaryPrompt(document: string): string {
  return `Write a clear summary of the document below in Markdown.

Use this shape:
## Overview
Two or three sentences.
## Key points
Four to six bullets.
## What happens next
One to three bullets, or "Nothing agreed." if there are none.

<document>
${document}
</document>`;
}

export function insightsPrompt(document: string): string {
  return `Extract structured insights from the document below. Only use facts stated in it.

<document>
${document}
</document>`;
}

export function chatInstructions(document: string): string {
  return `You answer questions about one document, given below. This document is your only source.

- Answer from the document. Quote short phrases when it helps.
- If the answer is not in the document, say so plainly instead of guessing.
- Keep answers short: a few sentences or a short list.

<document>
${document}
</document>`;
}
