import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";

export const Route = createFileRoute("/student-council")({
  head: () => ({ meta: [{ title: "Student Council | AI & ML Department" }, { name: "description", content: "Student council of the AI & ML Department." }] }),
  component: SC,
});

function SC() {
  const { data } = useQuery({
    queryKey: ["council"],
    queryFn: async () => (await supabase.from("student_council").select("*").eq("is_visible", true).order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader title="Student Council" subtitle="Student representatives and leaders." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((m) => (
              <div key={m.id} className="rounded-lg border p-5 text-center">
                {m.photo_url ? <img src={m.photo_url} alt={m.name} className="mx-auto size-24 rounded-full object-cover" /> : <div className="mx-auto size-24 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground">{m.name.charAt(0)}</div>}
                <h3 className="mt-3 font-semibold">{m.name}</h3>
                {m.designation && <p className="text-sm text-primary">{m.designation}</p>}
                {m.contact && <p className="text-sm text-muted-foreground mt-1">{m.contact}</p>}
              </div>
            ))}
          </div>
        ) : <EmptyState>No council members yet.</EmptyState>}
      </Section>
    </>
  );
}
