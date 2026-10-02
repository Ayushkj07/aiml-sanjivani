import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Layout";
import { GallerySlider } from "@/components/site/GallerySlider";
import { HodMessage } from "@/components/site/HodMessage";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home | AI & ML Department Activity Portal" },
      { name: "description", content: "Official portal of the Department of Artificial Intelligence & Machine Learning — events, faculty, research, and more." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: content } = useQuery({
    queryKey: ["site_content", "home"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("key,value").in("key", ["home_hero", "hod"]);
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value as Record<string, unknown>]));
    },
  });
  const { data: latestNews } = useQuery({
    queryKey: ["news", "latest"],
    queryFn: async () => (await supabase.from("news").select("*").eq("is_visible", true).order("published_at", { ascending: false }).limit(3)).data ?? [],
  });
  const { data: upcomingEvents } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => (await supabase.from("events").select("*").eq("is_visible", true).order("event_date", { ascending: false }).limit(3)).data ?? [],
  });

  const hero = (content?.home_hero ?? {}) as { title?: string; subtitle?: string; cta_text?: string; cta_link?: string; background_image?: string };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b"
        style={hero.background_image ? { backgroundImage: `linear-gradient(rgba(20,25,50,0.75), rgba(20,25,50,0.75)), url(${hero.background_image})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(135deg, var(--brand-muted), var(--secondary))" }}
      >
        <div className={`mx-auto max-w-7xl px-4 py-20 md:py-28 ${hero.background_image ? "text-white" : ""}`}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">{hero.title || "Department of Artificial Intelligence & Machine Learning"}</h1>
          <p className={`mt-4 max-w-2xl text-lg ${hero.background_image ? "opacity-90" : "text-muted-foreground"}`}>{hero.subtitle || "Empowering innovation through intelligent systems"}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={hero.cta_link || "/about"} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90">
              {hero.cta_text || "Explore Department"} <ArrowRight className="size-4" />
            </Link>
            <Link to="/faculty" className={`inline-flex items-center gap-2 rounded-md border px-5 py-3 font-medium ${hero.background_image ? "border-white/40 hover:bg-white/10" : "hover:bg-accent"}`}>
              Meet Faculty
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Slider */}
      <Section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Gallery</h2>
            <p className="text-sm text-muted-foreground mt-1">Moments from our department events and activities.</p>
          </div>
          <Link to="/gallery" className="text-sm text-primary hidden sm:inline">View all →</Link>
        </div>
        <GallerySlider />
      </Section>

      {/* HOD */}
      <Section>
        <HodMessage />
      </Section>

      {/* Latest news + events */}
      <Section className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <Link to="/news" className="text-sm text-primary">View all →</Link>
          </div>
          <div className="space-y-3">
            {(latestNews ?? []).map((n) => (
              <div key={n.id} className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">{new Date(n.published_at).toLocaleDateString()}</div>
                <div className="font-semibold mt-1">{n.title}</div>
                {n.body && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{n.body}</p>}
              </div>
            ))}
            {(latestNews ?? []).length === 0 && <p className="text-sm text-muted-foreground">No news yet.</p>}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Events</h2>
            <Link to="/events" className="text-sm text-primary">View all →</Link>
          </div>
          <div className="space-y-3">
            {(upcomingEvents ?? []).map((e) => (
              <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="block rounded-lg border p-4 hover:border-primary">
                <div className="text-xs text-muted-foreground">{e.event_date ? new Date(e.event_date).toLocaleDateString() : ""}</div>
                <div className="font-semibold mt-1">{e.title}</div>
                {e.venue && <p className="text-sm text-muted-foreground">📍 {e.venue}</p>}
              </Link>
            ))}
            {(upcomingEvents ?? []).length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
          </div>
        </div>
      </Section>
    </div>
  );
}
