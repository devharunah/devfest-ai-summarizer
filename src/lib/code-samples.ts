// Stage-sized versions of each step's code: just the AI SDK call, none of the app's plumbing
// (input checks, error handling, shared prompt builders). The real files are linked under each sample.

export const TLDR_SAMPLE = `"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function quickTldr(document: string) {
  const { text, usage } = await generateText({
    model: openai("gpt-5.4-mini"),
    prompt: \`TL;DR in two sentences:\\n\\n\${document}\`,
  });

  // We only get here once the model has finished writing.
  return { text, usage };
}`;

export const STREAM_SAMPLE = `// app/api/summarize/route.ts
import { streamText, toTextStream, createTextStreamResponse } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: openai("gpt-5.4-mini"),
    prompt: \`Summarize in markdown:\\n\\n\${prompt}\`,
  });

  // Tokens reach the browser as the model writes them.
  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}

// In the component
const { completion, complete } = useCompletion({
  api: "/api/summarize",
  streamProtocol: "text",
});`;

export const INSIGHTS_SAMPLE = `import { z } from "zod";
import { streamText, Output } from "ai";
import { openai } from "@ai-sdk/openai";

// 1. Describe the shape you want.
const insightsSchema = z.object({
  title: z.string(),
  keyPoints: z.array(z.string()),
  actionItems: z.array(
    z.object({ task: z.string(), owner: z.string() }),
  ),
  sentiment: z.enum(["positive", "neutral", "mixed", "negative"]),
});

// 2. The model fills it in, and the SDK validates it.
const result = streamText({
  model: openai("gpt-5.4-mini"),
  output: Output.object({ schema: insightsSchema }),
  prompt: \`Extract the insights:\\n\\n\${document}\`,
});

// 3. In the component: a typed object that fills in as it streams.
const { object, submit } = useObject({
  api: "/api/extract",
  schema: insightsSchema,
});
object?.keyPoints; // string[] | undefined`;

export const CHAT_SAMPLE = `// app/api/chat/route.ts
import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages, document } = await req.json();

  const result = streamText({
    model: openai("gpt-5.4-mini"),
    // Model context: the document goes with every question.
    instructions: \`Answer from this document:\\n\\n\${document}\`,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

// In the component
const { messages, sendMessage } = useChat();
sendMessage(
  { text: "What decisions were made?" },
  { body: { document } },
);`;
