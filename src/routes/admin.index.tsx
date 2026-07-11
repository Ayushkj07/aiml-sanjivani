import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

const TABLES = ["events", "gallery_images", "faculty", "student_council", "achievements", "placements", "research", "news", "notices", "downloads"] as const;

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const results = await Promise.all(TABLES.map(async (t) => {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        return [t, count ?? 0] as const;
      }));
      return Object.fromEntries(results);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground text-sm">Overview of your department content.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TABLES.map((t) => (
          <div key={t} className="rounded-lg border p-5">
            <div className="text-xs uppercase text-muted-foreground">{t.replace(/_/g, " ")}</div>
            <div className="mt-1 text-3xl font-bold">{data?.[t] ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
