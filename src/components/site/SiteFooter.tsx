import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  const { data } = useQuery({
    queryKey: ["site_content", "footer_contact_social"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("key,value").in("key", ["footer", "contact", "social"]);
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value as Record<string, string>]));
      return map;
    },
  });
  const footer = (data?.footer ?? {}) as { description?: string; copyright?: string };
  const contact = (data?.contact ?? {}) as { address?: string; email?: string; phone?: string };
  const social = (data?.social ?? {}) as Record<string, string>;

  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="mx-auto max-w-7xl grid gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">AI</div>
            <div className="font-semibold">AI & ML Department</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">{footer.description || "Department of Artificial Intelligence & Machine Learning"}</p>
          <div className="mt-4 flex gap-3">
            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Facebook className="size-5" /></a>}
            {social.twitter && <a href={social.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Twitter className="size-5" /></a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Instagram className="size-5" /></a>}
            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin className="size-5" /></a>}
            {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Youtube className="size-5" /></a>}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/faculty" className="hover:text-primary">Faculty</Link></li>
            <li><Link to="/events" className="hover:text-primary">Events</Link></li>
            <li><Link to="/research" className="hover:text-primary">Research</Link></li>
            <li><Link to="/placements" className="hover:text-primary">Placements</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {contact.address && <li className="flex gap-2"><MapPin className="size-4 mt-0.5 shrink-0" /><span>{contact.address}</span></li>}
            {contact.email && <li className="flex gap-2"><Mail className="size-4 mt-0.5 shrink-0" /><a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a></li>}
            {contact.phone && <li className="flex gap-2"><Phone className="size-4 mt-0.5 shrink-0" /><a href={`tel:${contact.phone}`} className="hover:text-primary">{contact.phone}</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground text-center">
          {footer.copyright || "© 2026 AI & ML Department. All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
