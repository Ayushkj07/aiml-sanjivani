import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { assertOk, client, json } from "../helpers";

export default defineTool({
  name: "list_faculty",
  title: "List faculty",
  description: "List AI & ML department faculty members with designation, qualification and research area.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(50).describe("Maximum number of faculty to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const supabase = client(ctx);
    const { data, error } = await supabase
      .from("faculty")
      .select("id,name,designation,qualification,research_area,photo_url,sort_order")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .limit(limit);
    assertOk(error);
    return json(data ?? []);
  },
});
