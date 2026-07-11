import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "News | AI & ML Department" }, { name: "description", content: "Latest news from the AI & ML Department." }] }),
  component: News,
});

function News() {
  const { data } = useQuery({
    queryKey: ["news"],
    queryFn: async () => (await supabase.from("news").select("*").eq("is_visible", true).order("published_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader title="News" subtitle="Latest updates from the department." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="space-y-6">
            {data.map((n) => (
              <article key={n.id} className="rounded-lg border overflow-hidden md:flex">
                {n.image_url && <img src={n.image_url} alt={n.title} className="md:w-64 aspect-video md:aspect-square object-cover" />}
                <div className="p-5 flex-1">
                  <div className="text-xs text-muted-foreground">{new Date(n.published_at).toLocaleDateString()}</div>
                  <h2 className="mt-1 text-xl font-semibold">{n.title}</h2>
                  {n.body && <p className="mt-2 text-muted-foreground whitespace-pre-line">{n.body}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : <EmptyState>No news yet.</EmptyState>}
      </Section>
    </>
  );
}
