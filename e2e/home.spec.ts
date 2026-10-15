import { expect, test } from "@playwright/test";

// No live model calls here: CI has no OpenAI key. These prove the app renders,
// the UI wiring works, and the routes validate input before touching the model.

test("the page renders all four steps", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Python backend");
  for (const name of [
    "Quick TL;DR",
    "Streaming summary",
    "Structured insights",
    "Ask follow-up questions",
  ]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
});

test("loading the sample enables the actions", async ({ page }) => {
  await page.goto("/");

  const tldr = page.getByRole("button", { name: "Get TL;DR" });
  await expect(tldr).toBeDisabled();

  await page.getByRole("button", { name: "Load sample transcript" }).click();

  await expect(page.getByLabel("Document to summarize")).toHaveValue(/KawaPay/);
  await expect(page.getByTestId("word-count")).not.toContainText(/^0 words/);
  await expect(tldr).toBeEnabled();
  await expect(page.getByRole("button", { name: "Stream summary" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Extract insights" })).toBeEnabled();
});

test("show the code reveals the real route source", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Show the code").nth(1).click();

  await expect(page.getByText("streamText({").first()).toBeVisible();
});

for (const [path, body] of [
  ["/api/summarize", { prompt: "" }],
  ["/api/extract", { document: "" }],
  ["/api/chat", { messages: [], document: "" }],
] as const) {
  test(`${path} rejects an empty document with 400`, async ({ request }) => {
    const response = await request.post(path, { data: body });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: "Paste a document first." });
  });
}
