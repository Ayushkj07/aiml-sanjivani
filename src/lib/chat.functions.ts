import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MsgSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(4000),
});

const InputSchema = z.object({
  messages: z.array(MsgSchema).min(1).max(30),
});

const SYSTEM_PROMPT = `You are the friendly assistant for the Department of Artificial Intelligence & Machine Learning (AI & ML) at a university.

You help visitors, students, and prospective students with information about the department's programs (B.Tech / M.Tech in AI & ML), faculty, research areas, events, achievements, placements, admission process, and how to navigate the department portal.

- Answer concisely in a warm, professional tone.
- Use markdown formatting (short lists, bold) when helpful.
- If asked something outside the department's scope, gently redirect to relevant AI/ML/department topics.
- If you don't know a specific detail (like a specific event date not provided), say so and suggest checking the Events / Notices page.`;

export const chatWithGemini = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { generateText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const result = await generateText({
      model: gateway("google/gemini-2.5-flash"),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...data.messages,
      ],
    });

    return { reply: result.text };
  });
