import {
  MAX_DOCUMENT_CHARS,
  chatInstructions,
  checkDocument,
  compressionRatio,
  countWords,
  summaryPrompt,
} from "../ai/prompts";
import { insightsSchema } from "../ai/schemas";

describe("checkDocument", () => {
  it("rejects missing, non-string and blank input", () => {
    expect(checkDocument(undefined).ok).toBe(false);
    expect(checkDocument(42).ok).toBe(false);
    expect(checkDocument("   \n ").ok).toBe(false);
  });

  it("rejects documents over the limit", () => {
    const result = checkDocument("a".repeat(MAX_DOCUMENT_CHARS + 1));

    expect(result.ok).toBe(false);
  });

  it("accepts and trims a normal document", () => {
    expect(checkDocument("  hello world  ")).toEqual({ ok: true, document: "hello world" });
  });
});

describe("countWords", () => {
  it("counts whitespace-separated words", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("  one  two\nthree ")).toBe(3);
  });
});

describe("compressionRatio", () => {
  it("returns null when either side is empty", () => {
    expect(compressionRatio(0, 10)).toBeNull();
    expect(compressionRatio(10, 0)).toBeNull();
  });

  it("rounds the ratio", () => {
    expect(compressionRatio(2000, 190)).toBe("11x shorter");
  });
});

describe("prompts", () => {
  it("wrap the document in tags", () => {
    expect(summaryPrompt("DOC")).toContain("<document>\nDOC\n</document>");
    expect(chatInstructions("DOC")).toContain("<document>\nDOC\n</document>");
  });
});

describe("insightsSchema", () => {
  it("accepts a well-formed object", () => {
    const parsed = insightsSchema.safeParse({
      title: "Sync",
      oneLiner: "They agreed to fix sync.",
      keyPoints: ["a"],
      decisions: [],
      actionItems: [{ task: "Fix sync", owner: "Daniel" }],
      sentiment: "positive",
      topics: ["sync"],
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects an unknown sentiment", () => {
    const parsed = insightsSchema.safeParse({
      title: "",
      oneLiner: "",
      keyPoints: [],
      decisions: [],
      actionItems: [],
      sentiment: "ecstatic",
      topics: [],
    });

    expect(parsed.success).toBe(false);
  });
});
