import type { ToolContext } from "@lovable.dev/mcp-js";
import { ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "./supabase";

export function json(data: unknown, structured?: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    ...(structured ? { structuredContent: structured } : {}),
  };
}

export function client(ctx: ToolContext) {
  if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated. Sign in to use this tool.");
  return supabaseForUser(ctx);
}

export function assertOk(error: { message: string } | null) {
  if (error) throw new ToolError(error.message);
}
