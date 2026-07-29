import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Layout";
import { ArrowLeft } from "lucide-react";
import { ApplyNowButton, RegistrationBadge } from "@/components/site/ApplyNowButton";

export const Route = createFileRoute("/events/$id")({
  head: () => ({ meta: [{ title: "Event | AI & ML Department" }] }),
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("id", id).eq("is_visible", true).maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`event-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "events", filter: `id=eq.${id}` }, () => {
        qc.invalidateQueries({ queryKey: ["event", id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, qc]);

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!data) return null;
  return (
    <Section>
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-primary mb-4"><ArrowLeft className="size-4" /> Back to Events</Link>
      {data.poster_url && <img src={data.poster_url} alt={data.title} className="rounded-lg border w-full max-h-[500px] object-cover" />}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {data.event_date && <span>📅 {new Date(data.event_date).toLocaleDateString()}</span>}
            {data.venue && <span>📍 {data.venue}</span>}
            <RegistrationBadge event={data} />
          </div>
          {data.registration_deadline && (
            <p className="text-sm text-muted-foreground mt-2">
              Registration deadline: {new Date(data.registration_deadline).toLocaleDateString()}
            </p>
          )}
        </div>
        <ApplyNowButton event={data} />
      </div>
      {data.description && <p className="mt-6 text-muted-foreground whitespace-pre-line">{data.description}</p>}
      {data.images && data.images.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.images.map((url, i) => <img key={i} src={url} alt="" className="rounded-lg border aspect-square object-cover" />)}
        </div>
      )}
    </Section>
  );
}
