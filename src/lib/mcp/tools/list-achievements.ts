import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { assertOk, client, json } from "../helpers";

export default defineTool({
  name: "list_achievements",
  title: "List achievements",
  description: "List department achievements with category and date.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum number of achievements to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const supabase = client(ctx);
    const { data, error } = await supabase
      .from("achievements")
      .select("id,title,description,achievement_date,category,image_url")
      .eq("is_visible", true)
      .order("achievement_date", { ascending: false })
      .limit(limit);
    assertOk(error);
    return json(data ?? []);
  },
});
