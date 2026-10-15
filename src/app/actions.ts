"use server";

import { generateText } from "ai";

import { getModel, modelId } from "@/lib/ai/model";
import { checkDocument, tldrPrompt } from "@/lib/ai/prompts";

export type TldrResult =
  | {
      ok: true;
      text: string;
      model: string;
      ms: number;
      inputTokens: number | undefined;
      outputTokens: number | undefined;
    }
  | { ok: false; error: string };

// generateText: one request, one complete answer. No streaming, no API route.
export async function quickTldr(input: string): Promise<TldrResult> {
  const check = checkDocument(input);
  if (!check.ok) return check;

  const started = Date.now();

  try {
    const { text, usage } = await generateText({
      model: getModel(),
      prompt: tldrPrompt(check.document),
    });

    return {
      ok: true,
      text,
      model: modelId(),
      ms: Date.now() - started,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "The model call failed." };
  }
}
