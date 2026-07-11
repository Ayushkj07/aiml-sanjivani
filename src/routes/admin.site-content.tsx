import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/site-content")({ component: SiteContentAdmin });

const BLOCKS: { key: string; label: string; description: string }[] = [
  { key: "home_hero", label: "Home Hero", description: "Hero section on the home page" },
  { key: "about", label: "About Section", description: "About the department content" },
  { key: "vision", label: "Vision", description: "Department vision statement" },
  { key: "mission", label: "Mission", description: "Department mission (items array)" },
  { key: "hod", label: "HOD Message", description: "Head of Department info" },
  { key: "contact", label: "Contact Info", description: "Address, email, phone, map embed" },
  { key: "footer", label: "Footer", description: "Footer description and copyright" },
  { key: "social", label: "Social Links", description: "Facebook, Twitter, Instagram, LinkedIn, YouTube URLs" },
];

function SiteContentAdmin() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Site Content</h1>
      <p className="text-sm text-muted-foreground">Edit the editable text/image blocks used across the public site.</p>
      <div className="mt-6 space-y-4">
        {BLOCKS.map((b) => <BlockEditor key={b.key} {...b} />)}
      </div>
    </div>
  );
}

function BlockEditor({ key: k, label, description }: { key: string; label: string; description: string }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["site_content", k],
    queryFn: async () => (await supabase.from("site_content").select("value").eq("key", k).maybeSingle()).data?.value ?? {},
  });
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data !== undefined) setText(JSON.stringify(data, null, 2)); }, [data]);

  async function save() {
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { toast.error("Invalid JSON"); return; }
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key: k, value: parsed as never });
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); qc.invalidateQueries(); }
  }

  return (
    <details className="rounded-lg border p-4" open={k === "home_hero"}>
      <summary className="cursor-pointer font-semibold">{label} <span className="text-xs text-muted-foreground font-normal">— {description}</span></summary>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="mt-3 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs" />
      <div className="mt-2 flex justify-end">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
          {saving && <Loader2 className="size-4 animate-spin" />} Save
        </button>
      </div>
    </details>
  );
}
