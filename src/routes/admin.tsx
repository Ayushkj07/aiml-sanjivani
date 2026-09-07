import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, LayoutDashboard, Calendar, Image, Users, UserSquare2, Award, Briefcase, BookOpen, Newspaper, Bell, FileDown, Settings } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
    if (!role) throw redirect({ to: "/", replace: true });
    return { user: data.user };
  },
  component: AdminLayout,
});

const NAV: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/site-content", label: "Site Content", icon: Settings },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/faculty", label: "Faculty", icon: Users },
  { to: "/admin/student-council", label: "Student Council", icon: UserSquare2 },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/placements", label: "Placements", icon: Briefcase },
  { to: "/admin/subjects", label: "Subjects", icon: GraduationCap },
  { to: "/admin/research", label: "Research", icon: BookOpen },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/notices", label: "Notices", icon: Bell },
  { to: "/admin/downloads", label: "Downloads", icon: FileDown },
];

function AdminLayout() {
  const { user } = Route.useRouteContext() as { user: { email?: string } };
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { location } = useRouterState();
  const [openMenu, setOpenMenu] = useState(false);
  useEffect(() => { setOpenMenu(false); }, [location.pathname]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start rounded-lg border bg-card">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Signed in</div>
            <div className="text-sm font-medium truncate">{user.email}</div>
          </div>
          <button onClick={() => setOpenMenu((v) => !v)} className="lg:hidden text-sm text-primary">Menu</button>
        </div>
        <nav className={`p-2 space-y-0.5 ${openMenu ? "block" : "hidden lg:block"}`}>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact }} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent [&.active]:bg-primary [&.active]:text-primary-foreground">
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
          <button onClick={signOut} className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="size-4" /> Sign out
          </button>
        </nav>
      </aside>
      <div><Outlet /></div>
    </div>
  );
}
