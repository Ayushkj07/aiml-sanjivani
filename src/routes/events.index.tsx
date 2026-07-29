import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";
import { ApplyNowButton, RegistrationBadge } from "@/components/site/ApplyNowButton";

export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [{ title: "Events | AI & ML Department" }, { name: "description", content: "Department events, workshops, and activities." }] }),
  component: EventsPage,
});

function EventsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["events", "public"],
    queryFn: async () => (await supabase.from("events").select("*").eq("is_visible", true).order("event_date", { ascending: false })).data ?? [],
  });

  useEffect(() => {
    const channel = supabase
      .channel("events-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
        qc.invalidateQueries({ queryKey: ["events", "public"] });
        qc.invalidateQueries({ queryKey: ["event"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return (
    <>
      <PageHeader title="Events" subtitle="Workshops, seminars, conferences, and department activities." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((e) => (
              <div key={e.id} className="group rounded-lg border overflow-hidden hover:border-primary hover:shadow-sm transition-all flex flex-col">
                <Link to="/events/$id" params={{ id: e.id }} className="block">
                  {e.poster_url ? <img src={e.poster_url} alt={e.title} className="aspect-video w-full object-cover" /> : <div className="aspect-video bg-secondary flex items-center justify-center text-muted-foreground">No image</div>}
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2">
                    {e.event_date && <div className="text-xs text-muted-foreground">{new Date(e.event_date).toLocaleDateString()}</div>}
                    <RegistrationBadge event={e} />
                  </div>
                  <Link to="/events/$id" params={{ id: e.id }}>
                    <h3 className="font-semibold mt-1 group-hover:text-primary">{e.title}</h3>
                  </Link>
                  {e.venue && <p className="text-sm text-muted-foreground">📍 {e.venue}</p>}
                  {e.registration_deadline && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Deadline: {new Date(e.registration_deadline).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-3">
                    <ApplyNowButton event={e} size="sm" className="w-full sm:w-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState>No events yet.</EmptyState>}
      </Section>
    </>
  );
}
