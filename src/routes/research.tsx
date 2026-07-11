import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";
import { ExternalLink, FileText } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research | AI & ML Department" }, { name: "description", content: "Research papers, publications, and patents." }] }),
  component: Research,
});

function Research() {
  const { data } = useQuery({
    queryKey: ["research"],
    queryFn: async () => (await supabase.from("research").select("*").eq("is_visible", true).order("year", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader title="Research" subtitle="Papers, publications, and patents from our department." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="space-y-3">
            {data.map((r) => (
              <div key={r.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-primary/10 text-primary px-2 py-0.5 uppercase font-medium">{r.research_type}</span>
                  {r.year && <span className="text-muted-foreground">{r.year}</span>}
                </div>
                <h3 className="font-semibold mt-2">{r.title}</h3>
                {r.authors && <p className="text-sm text-muted-foreground mt-1">{r.authors}</p>}
                {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                <div className="mt-3 flex gap-4 text-sm">
                  {r.link_url && <a href={r.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><ExternalLink className="size-3.5" /> View</a>}
                  {r.file_url && <a href={r.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><FileText className="size-3.5" /> Download</a>}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState>No research entries yet.</EmptyState>}
      </Section>
    </>
  );
}
