import { createTextStreamResponse, streamText, toTextStream } from "ai";

import { getModel } from "@/lib/ai/model";
import { checkDocument, summaryPrompt } from "@/lib/ai/prompts";
import { badRequest, hasApiKey, logStreamError, missingKey } from "@/lib/ai/respond";

export const maxDuration = 30;

// streamText: tokens reach the browser as the model writes them.
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const check = checkDocument(prompt);
  if (!check.ok) return badRequest(check.error);
  if (!hasApiKey()) return missingKey();

  const result = streamText({
    model: getModel(),
    onError: logStreamError,
    prompt: summaryPrompt(check.document),
  });

  return createTextStreamResponse({ stream: toTextStream({ stream: result.stream }) });
}
