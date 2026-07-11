import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, Loader2 } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "date" | "image" | "file" | "select" | "checkbox";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  bucket?: "images" | "documents";
  accept?: string;
};

type Row = Record<string, unknown> & { id: string; is_visible?: boolean };

export function CrudManager({
  title, table, fields, orderBy = "sort_order", orderAsc = true,
}: { title: string; table: string; fields: Field[]; orderBy?: string; orderAsc?: boolean }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as never).select("*").order(orderBy, { ascending: orderAsc });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  async function toggleVisible(row: Row) {
    const { error } = await supabase.from(table as never).update({ is_visible: !row.is_visible } as never).eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin", table] }); qc.invalidateQueries(); }
  }
  async function remove(row: Row) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const { error } = await supabase.from(table as never).delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", table] }); qc.invalidateQueries(); }
  }

  const titleField = fields.find((f) => f.name === "title" || f.name === "name" || f.name === "student_name")?.name ?? fields[0].name;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">Create, edit, and manage {title.toLowerCase()}.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" /> Add new
        </button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left"><tr>
              <th className="p-3">Item</th><th className="p-3 w-24">Visible</th><th className="p-3 w-32 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {(data ?? []).map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-medium">{String(r[titleField] ?? "—")}</td>
                  <td className="p-3">
                    <button onClick={() => toggleVisible(r)} className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${r.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {r.is_visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {r.is_visible ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => setEditing(r)} className="text-primary hover:underline"><Pencil className="size-4 inline" /></button>
                    <button onClick={() => remove(r)} className="text-destructive hover:underline"><Trash2 className="size-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No entries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {(editing || creating) && (
        <RecordDialog table={table} fields={fields} initial={editing} onClose={() => { setEditing(null); setCreating(false); }} />
      )}
    </div>
  );
}

function RecordDialog({ table, fields, initial, onClose }: { table: string; fields: Field[]; initial: Row | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, unknown>>(initial ?? Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? true : ""])));
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      let v = form[f.name];
      if (v === "" || v === undefined) v = null;
      if (f.type === "number" && v !== null) v = Number(v);
      payload[f.name] = v;
    }
    const op = initial
      ? supabase.from(table as never).update(payload as never).eq("id", initial.id)
      : supabase.from(table as never).insert(payload as never);
    const { error } = await op;
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(initial ? "Updated" : "Created");
    qc.invalidateQueries({ queryKey: ["admin", table] });
    qc.invalidateQueries();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-card shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">{initial ? "Edit" : "Create"}</h2>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <form onSubmit={save} className="p-4 space-y-4">
          {fields.map((f) => (
            <FieldInput key={f.name} field={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
              {saving && <Loader2 className="size-4 animate-spin" />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    const bucket = field.bucket ?? (field.type === "image" ? "images" : "documents");
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }
  const v = (value ?? "") as string | number | boolean;
  return (
    <div>
      <label className="text-sm font-medium">{field.label}{field.required && " *"}</label>
      {field.type === "textarea" ? (
        <textarea value={v as string} onChange={(e) => onChange(e.target.value)} required={field.required} rows={4} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
      ) : field.type === "select" ? (
        <select value={v as string} onChange={(e) => onChange(e.target.value)} required={field.required} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
          <option value="">Select…</option>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : field.type === "checkbox" ? (
        <div className="mt-1"><label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!v} onChange={(e) => onChange(e.target.checked)} className="size-4" /> {field.label}</label></div>
      ) : field.type === "image" || field.type === "file" ? (
        <div className="mt-1 space-y-2">
          {v && field.type === "image" && <img src={v as string} alt="" className="h-32 rounded border object-cover" />}
          {v && field.type === "file" && <a href={v as string} target="_blank" rel="noreferrer" className="block text-sm text-primary hover:underline break-all">{v as string}</a>}
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-accent">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
              <input type="file" accept={field.accept} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            {v ? <button type="button" onClick={() => onChange("")} className="text-xs text-destructive">Remove</button> : null}
          </div>
          <input value={v as string} onChange={(e) => onChange(e.target.value)} placeholder="Or paste URL" className="w-full rounded-md border bg-background px-3 py-2 text-xs" />
        </div>
      ) : (
        <input
          type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
          value={v as string | number}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}
