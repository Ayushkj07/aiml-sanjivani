import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { assertOk, client, json } from "../helpers";

export default defineTool({
  name: "get_event",
  title: "Get an event",
  description: "Fetch one department event by its id, including all registration fields.",
  inputSchema: { id: z.string().uuid().describe("Event id.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const supabase = client(ctx);
    const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
    assertOk(error);
    if (!data) return { content: [{ type: "text" as const, text: `No event found with id ${id}` }], isError: true };
    return json(data);
  },
});
