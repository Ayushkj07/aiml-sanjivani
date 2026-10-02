import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { HOD_KEY, HodMessage, type HodContent } from "@/components/site/HodMessage";

export function HodEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["site_content", HOD_KEY],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("value").eq("key", HOD_KEY).maybeSingle();
      if (error) throw error;
      return (data?.value ?? {}) as HodContent;
    },
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title || data.name || "HOD Message");
    setBody(data.body || data.message || "");
    setImage(data.image || data.photo_url || "");
  }, [data]);

  async function upload(file: File) {
    setUploading(true);
    const path = `hod/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) { toast.error(`Upload failed: ${error.message}`); return; }
    setImage(supabase.storage.from("images").getPublicUrl(path).data.publicUrl);
    toast.success("Image uploaded — click Save to apply");
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key: HOD_KEY, value: { title, body, image } as never }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error(`Save failed: ${error.message}`);
    else { toast.success("HOD Message saved"); qc.invalidateQueries({ queryKey: ["site_content"] }); }
  }

  return (
    <details className="rounded-lg border p-4" open>
      <summary className="cursor-pointer font-semibold">HOD Message <span className="text-xs text-muted-foreground font-normal">— Title, message and photo</span></summary>
      <div className="mt-3 space-y-3">
        <label className="block text-sm font-medium">Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block text-sm font-medium">Body
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </label>
        <div className="text-sm font-medium">HOD Image</div>
        <div className="flex flex-wrap items-center gap-3">
          {image && <img src={image} alt="HOD" className="size-20 rounded-full object-cover border" />}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {image ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
          </label>
          {image && (
            <button type="button" onClick={() => setImage("")} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
              <Trash2 className="size-4" /> Remove image
            </button>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setPreview((v) => !v)} className="rounded-md border px-4 py-2 text-sm hover:bg-accent">{preview ? "Hide preview" : "Preview"}</button>
          <button onClick={save} disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {saving && <Loader2 className="size-4 animate-spin" />} Save
          </button>
        </div>
        {preview && <PreviewBox title={title} body={body} image={image} />}
      </div>
    </details>
  );
}

function PreviewBox({ title, body, image }: { title: string; body: string; image: string }) {
  return (
    <div className={`rounded-lg border p-6 ${image ? "md:flex md:gap-8 md:items-start" : ""}`}>
      {image && <img src={image} alt={title} className="size-32 rounded-full object-cover mx-auto md:mx-0 shrink-0" />}
      <div className={`${image ? "mt-4 md:mt-0" : ""} flex-1`}>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-4 text-muted-foreground whitespace-pre-line">{body}</p>
      </div>
    </div>
  );
}

export { HodMessage };
