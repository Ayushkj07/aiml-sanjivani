import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { assertOk, client, json } from "../helpers";

export default defineTool({
  name: "create_event",
  title: "Create an event",
  description: "Create a department event. Requires an admin account.",
  inputSchema: {
    title: z.string().trim().min(1).describe("Event title."),
    description: z.string().trim().optional().describe("Event description."),
    event_date: z.string().trim().optional().describe("Event date as YYYY-MM-DD."),
    venue: z.string().trim().optional().describe("Venue."),
    registration_url: z.string().url().optional().describe("Registration / apply link."),
    registration_button_text: z.string().trim().optional().describe("Button label, defaults to Apply Now."),
    registration_deadline: z.string().trim().optional().describe("Registration deadline as YYYY-MM-DD."),
    registration_enabled: z.boolean().optional().describe("Whether the registration button shows publicly."),
    is_visible: z.boolean().default(true).describe("Whether the event is visible on the public site."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const supabase = client(ctx);
    const payload = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined && v !== ""));
    const { data, error } = await supabase.from("events").insert(payload).select().single();
    assertOk(error);
    return json(data, { event: data as Record<string, unknown> });
  },
});
