import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { assertOk, client, json } from "../helpers";

export default defineTool({
  name: "create_notice",
  title: "Create a notice",
  description: "Publish a department notice. Requires an admin account. Notices are hidden until is_visible is true.",
  inputSchema: {
    title: z.string().trim().min(1).describe("Notice title."),
    description: z.string().trim().optional().describe("Notice body text."),
    file_url: z.string().url().optional().describe("Public URL of an attached PDF or document."),
    is_visible: z.boolean().default(false).describe("Publish immediately on the public site."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const supabase = client(ctx);
    const payload = Object.fromEntries(
      Object.entries(input).filter(([, v]) => v !== undefined && v !== ""),
    ) as Record<string, never>;
    const { data, error } = await supabase.from("notices").insert(payload).select().single();
    assertOk(error);
    return json(data, { notice: data as Record<string, unknown> });
  },
});
