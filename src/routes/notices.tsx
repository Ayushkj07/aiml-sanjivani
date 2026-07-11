import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/notices")({
  head: () => ({ meta: [{ title: "Notices | AI & ML Department" }, { name: "description", content: "Official notices from the AI & ML Department." }] }),
  component: Notices,
});

function Notices() {
  const { data } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => (await supabase.from("notices").select("*").eq("is_visible", true).order("published_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader title="Notices" subtitle="Official notices and announcements." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="space-y-3">
            {data.map((n) => (
              <div key={n.id} className="rounded-lg border p-4 flex items-start gap-4">
                <FileText className="size-5 text-primary shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold">{n.title}</h3>
                  <div className="text-xs text-muted-foreground">{new Date(n.published_at).toLocaleDateString()}</div>
                  {n.description && <p className="text-sm text-muted-foreground mt-1">{n.description}</p>}
                </div>
                {n.file_url && <a href={n.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><Download className="size-4" /> Download</a>}
              </div>
            ))}
          </div>
        ) : <EmptyState>No notices yet.</EmptyState>}
      </Section>
    </>
  );
}
