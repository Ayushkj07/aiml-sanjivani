import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/faculty", label: "Faculty" },
  { to: "/student-council", label: "Student Council" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/achievements", label: "Achievements" },
  { to: "/placements", label: "Placements" },
  { to: "/research", label: "Research" },
  { to: "/news", label: "News" },
  { to: "/notices", label: "Notices" },
  { to: "/downloads", label: "Downloads" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const { location } = useRouterState();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ? { email: data.user.email } : null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ? { email: session.user.email } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/aiml-logo.png" alt="Sanjivani University — Department of AIML" className="size-14 object-contain" />
          <div className="hidden sm:block">
            <div className="text-base font-semibold leading-tight">AI & ML Department</div>
            <div className="text-sm text-muted-foreground leading-tight">Activity Portal</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.slice(0, 8).map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-foreground [&.active]:text-primary [&.active]:font-medium" activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
          <div className="group relative">
            <button className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent">More</button>
            <div className="invisible absolute right-0 top-full min-w-48 rounded-md border bg-popover p-1 opacity-0 shadow-lg group-hover:visible group-hover:opacity-100">
              {NAV.slice(8).map((n) => (
                <Link key={n.to} to={n.to} className="block rounded px-3 py-2 text-sm hover:bg-accent">{n.label}</Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/admin" className="hidden sm:inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Admin</Link>
          ) : (
            <Link to="/auth" className="hidden sm:inline-flex rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent">Sign in</Link>
          )}
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden rounded-md p-2 hover:bg-accent" aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t bg-background">
          <div className="mx-auto max-w-7xl grid grid-cols-2 gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm hover:bg-accent [&.active]:bg-accent [&.active]:text-primary">{n.label}</Link>
            ))}
            {user ? (
              <Link to="/admin" className="col-span-2 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">Admin Dashboard</Link>
            ) : (
              <Link to="/auth" className="col-span-2 rounded-md border px-3 py-2 text-center text-sm font-medium">Sign in</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
