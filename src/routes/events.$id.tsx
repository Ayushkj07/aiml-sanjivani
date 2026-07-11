import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Layout";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/events/$id")({
  head: () => ({ meta: [{ title: "Event | AI & ML Department" }] }),
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("id", id).eq("is_visible", true).maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });
  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!data) return null;
  return (
    <Section>
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-primary mb-4"><ArrowLeft className="size-4" /> Back to Events</Link>
      {data.poster_url && <img src={data.poster_url} alt={data.title} className="rounded-lg border w-full max-h-[500px] object-cover" />}
      <h1 className="mt-6 text-3xl font-bold">{data.title}</h1>
      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {data.event_date && <span>📅 {new Date(data.event_date).toLocaleDateString()}</span>}
        {data.venue && <span>📍 {data.venue}</span>}
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
