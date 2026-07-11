import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Gallery | AI & ML Department" }, { name: "description", content: "Photos from AI & ML Department events and activities." }] }),
  component: Gallery,
});

function Gallery() {
  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => (await supabase.from("gallery_images").select("*").eq("is_visible", true).order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader title="Gallery" subtitle="Moments from department events and activities." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((g) => (
              <a key={g.id} href={g.image_url} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-lg border">
                <img src={g.image_url} alt={g.caption || ""} className="aspect-square w-full object-cover transition group-hover:scale-105" />
                {g.caption && <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 group-hover:opacity-100">{g.caption}</div>}
              </a>
            ))}
          </div>
        ) : <EmptyState>No gallery images yet.</EmptyState>}
      </Section>
    </>
  );
}
