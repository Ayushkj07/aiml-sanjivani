import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";
import { Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/faculty")({
  head: () => ({ meta: [{ title: "Faculty | AI & ML Department" }, { name: "description", content: "Meet the faculty of the Department of AI & ML." }] }),
  component: FacultyPage,
});

function FacultyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["faculty", "public"],
    queryFn: async () => (await supabase.from("faculty").select("*").eq("is_visible", true).order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader title="Faculty" subtitle="Our team of expert educators and researchers." />
      <Section>
        {isLoading ? <div className="text-muted-foreground">Loading…</div> : (data && data.length > 0) ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((f) => (
              <div key={f.id} className="rounded-lg border p-5">
                {f.photo_url ? <img src={f.photo_url} alt={f.name} className="size-24 rounded-full object-cover" /> : <div className="size-24 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground">{f.name.charAt(0)}</div>}
                <h3 className="mt-3 font-semibold">{f.name}</h3>
                {f.designation && <p className="text-sm text-primary">{f.designation}</p>}
                {f.qualification && <p className="text-sm text-muted-foreground mt-1">{f.qualification}</p>}
                {f.research_area && <p className="text-sm text-muted-foreground mt-1"><span className="font-medium">Research:</span> {f.research_area}</p>}
                <div className="mt-3 space-y-1 text-sm">
                  {f.email && <a href={`mailto:${f.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Mail className="size-3.5" />{f.email}</a>}
                  {f.phone && <a href={`tel:${f.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Phone className="size-3.5" />{f.phone}</a>}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState>No faculty entries yet. Admins can add them from the dashboard.</EmptyState>}
      </Section>
    </>
  );
}
