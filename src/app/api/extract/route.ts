import { Output, createTextStreamResponse, streamText, toTextStream } from "ai";

import { getModel } from "@/lib/ai/model";
import { checkDocument, insightsPrompt } from "@/lib/ai/prompts";
import { badRequest, hasApiKey, logStreamError, missingKey } from "@/lib/ai/respond";
import { insightsSchema } from "@/lib/ai/schemas";

export const maxDuration = 30;

// Structured output: the Zod schema constrains the model, and the
// partial object streams to useObject on the client.
export async function POST(req: Request) {
  const { document } = await req.json();
  const check = checkDocument(document);
  if (!check.ok) return badRequest(check.error);
  if (!hasApiKey()) return missingKey();

  const result = streamText({
    model: getModel(),
    onError: logStreamError,
    output: Output.object({ schema: insightsSchema }),
    prompt: insightsPrompt(check.document),
  });

  return createTextStreamResponse({ stream: toTextStream({ stream: result.stream }) });
}
