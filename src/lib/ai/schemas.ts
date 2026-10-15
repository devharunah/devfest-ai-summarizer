import { z } from "zod";

// Shared by the server (to constrain the model) and the client (to type the partial stream).
export const insightsSchema = z.object({
  title: z.string().describe("A short, specific title for the document"),
  oneLiner: z.string().describe("The whole document in one sentence"),
  keyPoints: z.array(z.string()).describe("The 3 to 6 most important points, one sentence each"),
  decisions: z.array(z.string()).describe("Decisions that were made. Empty if none"),
  actionItems: z
    .array(
      z.object({
        task: z.string().describe("What needs to be done"),
        owner: z.string().describe("Who owns it, or 'Unassigned'"),
      }),
    )
    .describe("Concrete follow-up tasks. Empty if none"),
  sentiment: z.enum(["positive", "neutral", "mixed", "negative"]),
  topics: z.array(z.string()).describe("2 to 5 short topic tags"),
});

export type Insights = z.infer<typeof insightsSchema>;
