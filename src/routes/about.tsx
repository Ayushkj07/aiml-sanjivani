import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section } from "@/components/site/Layout";
import { HodMessage } from "@/components/site/HodMessage";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About | AI & ML Department" }, { name: "description", content: "About the Department of Artificial Intelligence & Machine Learning — vision, mission, and HOD's message." }] }),
  component: About,
});

function About() {
  const { data } = useQuery({
    queryKey: ["site_content", "about_page"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("key,value").in("key", ["about", "vision", "mission", "hod"]);
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value as Record<string, unknown>]));
    },
  });
  const about = (data?.about ?? {}) as { title?: string; body?: string; image?: string };
  const vision = (data?.vision ?? {}) as { title?: string; body?: string };
  const mission = (data?.mission ?? {}) as { title?: string; items?: string[] };

  return (
    <>
      <PageHeader title="About the Department" subtitle="Learn more about our vision, mission, and leadership." />
      <Section className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold">{about.title}</h2>
            <p className="mt-4 text-muted-foreground whitespace-pre-line">{about.body}</p>
          </div>
          {about.image && <img src={about.image} alt="Department" className="rounded-lg border" />}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">{vision.title}</h3>
            <p className="mt-2 text-muted-foreground">{vision.body}</p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">{mission.title}</h3>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              {(mission.items ?? []).map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>
        <HodMessage />
      </Section>
    </>
  );
}
