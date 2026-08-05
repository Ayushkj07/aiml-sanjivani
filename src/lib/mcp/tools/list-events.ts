import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { assertOk, client, json } from "../helpers";

export default defineTool({
  name: "list_events",
  title: "List department events",
  description: "List AI & ML department events, newest first, including registration link details.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum number of events to return."),
    include_hidden: z.boolean().default(false).describe("Include events that are hidden from the public site."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, include_hidden }, ctx) => {
    const supabase = client(ctx);
    let query = supabase
      .from("events")
      .select("id,title,description,event_date,venue,poster_url,is_visible,registration_url,registration_button_text,registration_deadline,registration_enabled,sort_order")
      .order("event_date", { ascending: false })
      .limit(limit);
    if (!include_hidden) query = query.eq("is_visible", true);
    const { data, error } = await query;
    assertOk(error);
    return json(data ?? []);
  },
});
