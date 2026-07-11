import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/downloads")({
  head: () => ({ meta: [{ title: "Downloads | AI & ML Department" }, { name: "description", content: "Syllabus, forms, calendars, and other downloadable resources." }] }),
  component: Downloads,
});

const LABELS: Record<string, string> = {
  syllabus: "Syllabus", form: "Forms", calendar: "Academic Calendar", timetable: "Time Table", circular: "Circulars",
};

function Downloads() {
  const { data } = useQuery({
    queryKey: ["downloads"],
    queryFn: async () => (await supabase.from("downloads").select("*").eq("is_visible", true).order("sort_order")).data ?? [],
  });
  const grouped: Record<string, typeof data> = {};
  (data ?? []).forEach((d) => { (grouped[d.category] ??= [] as never).push(d as never); });

  return (
    <>
      <PageHeader title="Downloads" subtitle="Syllabus, forms, timetables, calendars, and circulars." />
      <Section>
        {Object.keys(grouped).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="text-lg font-semibold mb-3">{LABELS[cat] || cat}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {(items ?? []).map((d) => (
                    <div key={d.id} className="rounded-lg border p-4 flex items-start gap-3">
                      <FileText className="size-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{d.title}</div>
                        {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
                      </div>
                      {d.file_url && <a href={d.file_url} target="_blank" rel="noreferrer" className="text-primary" aria-label="Download"><Download className="size-4" /></a>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState>No downloads yet.</EmptyState>}
      </Section>
    </>
  );
}
