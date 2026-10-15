export function badRequest(error: string): Response {
  return Response.json({ error }, { status: 400 });
}

export function hasApiKey(): boolean {
  return Boolean(process.env["OPENAI_API_KEY"]);
}

export function missingKey(): Response {
  return Response.json(
    { error: "OPENAI_API_KEY is not set. Add it to .env.local and restart the dev server." },
    { status: 500 },
  );
}

// Once a stream has started the status is already 200, so failures mid-stream
// (bad key, quota, network) are logged here for the terminal.
export function logStreamError({ error }: { error: unknown }): void {
  console.error("[ai] stream failed:", error instanceof Error ? error.message : error);
}
