import {
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";

import { getModel } from "@/lib/ai/model";
import { chatInstructions, checkDocument } from "@/lib/ai/prompts";
import { badRequest, hasApiKey, logStreamError, missingKey } from "@/lib/ai/respond";

export const maxDuration = 30;

// Chat with model context: the document rides along as instructions on every turn,
// and the full message history comes from useChat.
export async function POST(req: Request) {
  const { messages, document }: { messages: UIMessage[]; document: unknown } = await req.json();
  const check = checkDocument(document);
  if (!check.ok) return badRequest(check.error);
  if (!hasApiKey()) return missingKey();

  const result = streamText({
    model: getModel(),
    onError: logStreamError,
    instructions: chatInstructions(check.document),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
}
