import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Layout";
import { ArrowRight, Calendar, Users, Award, BookOpen } from "lucide-react";

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
      const { data } = await supabase.from("site_content").select("key,value").in("key", ["home_hero", "about", "vision", "mission", "hod"]);
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
  const about = (content?.about ?? {}) as { title?: string; body?: string };
  const vision = (content?.vision ?? {}) as { title?: string; body?: string };
  const mission = (content?.mission ?? {}) as { title?: string; items?: string[] };
  const hod = (content?.hod ?? {}) as { name?: string; designation?: string; message?: string; photo_url?: string; qualification?: string };

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

      {/* Quick links */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Faculty", to: "/faculty", desc: "Meet our expert educators" },
            { icon: Calendar, label: "Events", to: "/events", desc: "Latest department events" },
            { icon: Award, label: "Achievements", to: "/achievements", desc: "Student & faculty wins" },
            { icon: BookOpen, label: "Research", to: "/research", desc: "Papers & publications" },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="group rounded-lg border p-5 transition hover:border-primary hover:shadow-sm">
              <c.icon className="size-6 text-primary" />
              <div className="mt-3 font-semibold">{c.label}</div>
              <div className="text-sm text-muted-foreground">{c.desc}</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{about.title || "About the Department"}</h2>
          <p className="mt-4 text-muted-foreground whitespace-pre-line">{about.body}</p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-primary font-medium">Read more <ArrowRight className="size-4" /></Link>
        </div>
        <div className="rounded-lg border bg-secondary/40 p-8">
          <h3 className="font-semibold text-lg">{vision.title || "Our Vision"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{vision.body}</p>
          <h3 className="mt-6 font-semibold text-lg">{mission.title || "Our Mission"}</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            {(mission.items ?? []).map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      </Section>

      {/* HOD */}
      <Section>
        <div className="rounded-lg border p-6 md:p-10 md:flex md:gap-8 md:items-start">
          {hod.photo_url ? (
            <img src={hod.photo_url} alt={hod.name} className="size-32 rounded-full object-cover mx-auto md:mx-0" />
          ) : (
            <div className="size-32 rounded-full bg-secondary mx-auto md:mx-0 flex items-center justify-center text-3xl font-bold text-muted-foreground">HOD</div>
          )}
          <div className="mt-4 md:mt-0 flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold">{hod.name}</h3>
            <p className="text-sm text-muted-foreground">{hod.designation}</p>
            {hod.qualification && <p className="text-sm text-muted-foreground">{hod.qualification}</p>}
            <p className="mt-4 text-muted-foreground italic">"{hod.message}"</p>
          </div>
        </div>
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
