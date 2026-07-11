import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements | AI & ML Department" }, { name: "description", content: "Student and faculty achievements at the AI & ML Department." }] }),
  component: Achievements,
});

function Achievements() {
  const { data } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => (await supabase.from("achievements").select("*").eq("is_visible", true).order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader title="Achievements" subtitle="Celebrating our students' and faculty's successes." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((a) => (
              <div key={a.id} className="rounded-lg border overflow-hidden">
                {a.image_url && <img src={a.image_url} alt={a.title} className="aspect-video w-full object-cover" />}
                <div className="p-4">
                  {a.category && <div className="text-xs uppercase text-primary font-medium">{a.category}</div>}
                  <h3 className="font-semibold mt-1">{a.title}</h3>
                  {a.achievement_date && <div className="text-xs text-muted-foreground mt-1">{new Date(a.achievement_date).toLocaleDateString()}</div>}
                  {a.description && <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState>No achievements yet.</EmptyState>}
      </Section>
    </>
  );
}
