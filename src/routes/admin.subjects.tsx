import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, X, Loader2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/subjects")({ component: AdminSubjects });

type Subject = {
  id: string;
  name: string;
  code: string;
  semester: number;
  credits: number | null;
  description: string;
  faculty_name: string;
  syllabus_url: string | null;
  notes_url: string | null;
  image_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function AdminSubjects() {
  const qc = useQueryClient();
  const [semester, setSemester] = useState(1);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [creating, setCreating] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "subjects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subjects").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Subject[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("subjects-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "subjects" }, () => {
        qc.invalidateQueries({ queryKey: ["admin", "subjects"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const rows = (data ?? []).filter((s) => s.semester === semester);

  async function toggleVisible(row: Subject) {
    const { error } = await supabase.from("subjects").update({ is_visible: !row.is_visible }).eq("id", row.id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin", "subjects"] });
  }

  async function remove(row: Subject) {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("subjects").delete().eq("id", row.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "subjects"] }); }
  }

  async function reorder(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const ids = rows.map((r) => r.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setDragId(null);
    const updates = ids.map((id, i) => supabase.from("subjects").update({ sort_order: i }).eq("id", id));
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(failed.error.message);
    qc.invalidateQueries({ queryKey: ["admin", "subjects"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-sm text-muted-foreground">Manage semester-wise subjects, syllabus and notes.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" /> Add subject
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {SEMESTERS.map((s) => (
          <button
            key={s}
            onClick={() => setSemester(s)}
            className={`rounded-md px-3 py-1.5 text-sm ${s === semester ? "bg-primary text-primary-foreground" : "border hover:bg-accent"}`}
          >
            Sem {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left"><tr>
              <th className="p-3 w-10" /><th className="p-3">Subject</th><th className="p-3 w-24">Visible</th><th className="p-3 w-32 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  draggable
                  onDragStart={() => setDragId(r.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => reorder(r.id)}
                  className={`border-t ${dragId === r.id ? "opacity-50" : ""}`}
                >
                  <td className="p-3 cursor-grab text-muted-foreground"><GripVertical className="size-4" /></td>
                  <td className="p-3">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{[r.code, r.credits != null ? `${r.credits} credits` : null, r.faculty_name].filter(Boolean).join(" • ")}</div>
                  </td>
                  <td className="p-3">
                    <button onClick={() => toggleVisible(r)} className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${r.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {r.is_visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {r.is_visible ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => setEditing(r)} className="text-primary"><Pencil className="size-4 inline" /></button>
                    <button onClick={() => remove(r)} className="text-destructive"><Trash2 className="size-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No subjects in Semester {semester} yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {(editing || creating) && (
        <SubjectDialog
          initial={editing}
          defaultSemester={semester}
          nextOrder={rows.length}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}
    </div>
  );
}

function SubjectDialog({ initial, defaultSemester, nextOrder, onClose }: { initial: Subject | null; defaultSemester: number; nextOrder: number; onClose: () => void }) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    code: initial?.code ?? "",
    semester: initial?.semester ?? defaultSemester,
    credits: initial?.credits != null ? String(initial.credits) : "",
    description: initial?.description ?? "",
    faculty_name: initial?.faculty_name ?? "",
    syllabus_url: initial?.syllabus_url ?? "",
    notes_url: initial?.notes_url ?? "",
    image_url: initial?.image_url ?? "",
    is_visible: initial?.is_visible ?? true,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      semester: Number(form.semester),
      credits: form.credits === "" ? null : Number(form.credits),
      description: form.description,
      faculty_name: form.faculty_name,
      syllabus_url: form.syllabus_url || null,
      notes_url: form.notes_url || null,
      image_url: form.image_url || null,
      is_visible: form.is_visible,
    };
    const { error } = initial
      ? await supabase.from("subjects").update(payload).eq("id", initial.id)
      : await supabase.from("subjects").insert({ ...payload, sort_order: nextOrder });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(initial ? "Updated" : "Created");
    qc.invalidateQueries({ queryKey: ["admin", "subjects"] });
    qc.invalidateQueries({ queryKey: ["subjects"] });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-card shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">{initial ? "Edit subject" : "Add subject"}</h2>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <form onSubmit={save} className="p-4 space-y-4">
          <Text label="Subject name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Text label="Subject code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
            <div>
              <label className="text-sm font-medium">Semester</label>
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <Text label="Credits" type="number" value={form.credits} onChange={(v) => setForm({ ...form, credits: v })} />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Text label="Faculty name" value={form.faculty_name} onChange={(v) => setForm({ ...form, faculty_name: v })} />
          <FileField label="Syllabus PDF" bucket="documents" accept="application/pdf" value={form.syllabus_url} onChange={(v) => setForm({ ...form, syllabus_url: v })} />
          <FileField label="Notes PDF" bucket="documents" accept="application/pdf" value={form.notes_url} onChange={(v) => setForm({ ...form, notes_url: v })} />
          <FileField label="Subject image" bucket="images" accept="image/*" preview value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="size-4" /> Active (visible on website)
          </label>
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

function Text({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && " *"}</label>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function FileField({ label, bucket, accept, value, onChange, preview }: { label: string; bucket: "images" | "documents"; accept: string; value: string; onChange: (v: string) => void; preview?: boolean }) {
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    const path = `subjects/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); setUploading(false); return; }
    onChange(supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl);
    setUploading(false);
  }
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 space-y-2">
        {value && preview && <img src={value} alt="" className="h-28 rounded border object-cover" />}
        {value && !preview && <a href={value} target="_blank" rel="noreferrer" className="block break-all text-sm text-primary hover:underline">{value}</a>}
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
            <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
            <input type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
          {value && <button type="button" onClick={() => onChange("")} className="text-xs text-destructive">Remove</button>}
        </div>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Or paste URL" className="w-full rounded-md border bg-background px-3 py-2 text-xs" />
      </div>
    </div>
  );
}
