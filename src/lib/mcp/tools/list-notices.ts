import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { assertOk, client, json } from "../helpers";

export default defineTool({
  name: "list_notices",
  title: "List notices",
  description: "List department notices with their attached file links, newest first.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum number of notices to return."),
    include_hidden: z.boolean().default(false).describe("Include unpublished/hidden notices."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, include_hidden }, ctx) => {
    const supabase = client(ctx);
    let query = supabase
      .from("notices")
      .select("id,title,description,file_url,published_at,is_visible")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (!include_hidden) query = query.eq("is_visible", true);
    const { data, error } = await query;
    assertOk(error);
    return json(data ?? []);
  },
});
