import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section, EmptyState } from "@/components/site/Layout";

export const Route = createFileRoute("/placements")({
  head: () => ({ meta: [{ title: "Placements | AI & ML Department" }, { name: "description", content: "Student placement records at the AI & ML Department." }] }),
  component: Placements,
});

function Placements() {
  const { data } = useQuery({
    queryKey: ["placements"],
    queryFn: async () => (await supabase.from("placements").select("*").eq("is_visible", true).order("year", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader title="Placements" subtitle="Our students placed in top companies." />
      <Section>
        {(data && data.length > 0) ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left"><tr>
                <th className="p-3">Student</th><th className="p-3">Company</th><th className="p-3">Package</th><th className="p-3">Year</th>
              </tr></thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3 font-medium">{p.student_name}</td>
                    <td className="p-3 flex items-center gap-2">
                      {p.company_logo_url && <img src={p.company_logo_url} alt="" className="size-6 rounded object-contain" />}
                      {p.company}
                    </td>
                    <td className="p-3">{p.package || "—"}</td>
                    <td className="p-3 text-muted-foreground">{p.year || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState>No placement records yet.</EmptyState>}
      </Section>
    </>
  );
}
