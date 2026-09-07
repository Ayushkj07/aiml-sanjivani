import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState, Loading } from "@/components/site/Layout";
import { BookOpen, FileText, NotebookPen, Search, User, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Semester-wise Subjects | AI & ML Department" },
      { name: "description", content: "Browse AI & ML subjects semester by semester with syllabus and notes PDFs." },
      { property: "og:title", content: "Semester-wise Subjects | AI & ML Department" },
      { property: "og:description", content: "Browse AI & ML subjects semester by semester with syllabus and notes PDFs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Subjects,
});

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function Subjects() {
  const qc = useQueryClient();
  const [semester, setSemester] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subjects").select("*").eq("is_visible", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("subjects-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "subjects" }, () => {
        qc.invalidateQueries({ queryKey: ["subjects"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const all = data ?? [];
  const countFor = (s: number) => all.filter((x) => x.semester === s).length;
  const list = all
    .filter((x) => x.semester === semester)
    .filter((x) => {
      const t = q.trim().toLowerCase();
      if (!t) return true;
      return [x.name, x.code, x.faculty_name, x.description].some((f) => (f ?? "").toLowerCase().includes(t));
    });

  return (
    <>
      <PageHeader title="Subjects" subtitle="Semester-wise subjects for the AI & Machine Learning department, with syllabus and notes." />
      <Section>
        {isLoading ? (
          <Loading />
        ) : semester === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-300">
            {SEMESTERS.map((s) => (
              <button
                key={s}
                onClick={() => { setSemester(s); setQ(""); }}
                className="group rounded-xl border bg-card p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg active:translate-y-0"
              >
                <BookOpen className="size-6 text-primary transition-transform group-hover:scale-110" />
                <div className="mt-3 text-lg font-semibold">Semester {s}</div>
                <div className="text-sm text-muted-foreground">
                  {countFor(s) > 0 ? `${countFor(s)} subject${countFor(s) > 1 ? "s" : ""}` : "Updating soon"}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => setSemester(null)} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                <ArrowLeft className="size-4" /> All semesters
              </button>
              <h2 className="text-xl font-semibold">Semester {semester}</h2>
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search subjects…"
                  className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="mt-6">
              {list.length === 0 ? (
                <EmptyState>{q ? "No subjects match your search." : "Subjects will be updated soon."}</EmptyState>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <article key={s.id} className="flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
                      {s.image_url && <img src={s.image_url} alt={s.name} loading="lazy" className="h-36 w-full object-cover" />}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-tight">{s.name}</h3>
                          {s.credits !== null && s.credits !== undefined && (
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s.credits} cr</span>
                          )}
                        </div>
                        {s.code && <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{s.code}</div>}
                        {s.description && <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>}
                        {s.faculty_name && (
                          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <User className="size-3.5" /> {s.faculty_name}
                          </div>
                        )}
                        {(s.syllabus_url || s.notes_url) && (
                          <div className="mt-4 flex flex-wrap gap-2 pt-1">
                            {s.syllabus_url && (
                              <a href={s.syllabus_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:opacity-90 active:scale-95">
                                <FileText className="size-3.5" /> Syllabus
                              </a>
                            )}
                            {s.notes_url && (
                              <a href={s.notes_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-transform hover:bg-accent active:scale-95">
                                <NotebookPen className="size-3.5" /> Notes
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
