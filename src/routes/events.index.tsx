import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";

export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [{ title: "Events | AI & ML Department" }, { name: "description", content: "Department events, workshops, and activities." }] }),
  component: EventsPage,
});

function EventsPage() {
  const { data } = useQuery({
    queryKey: ["events", "public"],
    queryFn: async () => (await supabase.from("events").select("*").eq("is_visible", true).order("event_date", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader title="Events" subtitle="Workshops, seminars, conferences, and department activities." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((e) => (
              <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="group rounded-lg border overflow-hidden hover:border-primary hover:shadow-sm">
                {e.poster_url ? <img src={e.poster_url} alt={e.title} className="aspect-video w-full object-cover" /> : <div className="aspect-video bg-secondary flex items-center justify-center text-muted-foreground">No image</div>}
                <div className="p-4">
                  {e.event_date && <div className="text-xs text-muted-foreground">{new Date(e.event_date).toLocaleDateString()}</div>}
                  <h3 className="font-semibold mt-1 group-hover:text-primary">{e.title}</h3>
                  {e.venue && <p className="text-sm text-muted-foreground">📍 {e.venue}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : <EmptyState>No events yet.</EmptyState>}
      </Section>
    </>
  );
}
