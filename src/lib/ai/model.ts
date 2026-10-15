import { createOpenAI } from "@ai-sdk/openai";

import { optionalEnv, requireEnv } from "@/lib/env";

export const DEFAULT_MODEL = "gpt-5.4-mini";

export function modelId(): string {
  return optionalEnv("OPENAI_MODEL", DEFAULT_MODEL);
}

// Built per request, not at import time, so `pnpm build` and the e2e suite run without a key.
export function getModel() {
  const openai = createOpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });

  return openai(modelId());
}
