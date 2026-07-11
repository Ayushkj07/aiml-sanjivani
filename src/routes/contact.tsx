import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Section } from "@/components/site/Layout";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | AI & ML Department" }, { name: "description", content: "Contact the AI & ML Department." }] }),
  component: Contact,
});

function Contact() {
  const { data } = useQuery({
    queryKey: ["site_content", "contact"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("value").eq("key", "contact").maybeSingle();
      return (data?.value as { address?: string; email?: string; phone?: string; map_embed?: string }) ?? {};
    },
  });
  return (
    <>
      <PageHeader title="Contact Us" subtitle="Get in touch with the department." />
      <Section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {data?.address && (<div className="flex gap-3"><MapPin className="size-5 text-primary mt-0.5" /><div><div className="font-medium">Address</div><p className="text-muted-foreground">{data.address}</p></div></div>)}
          {data?.email && (<div className="flex gap-3"><Mail className="size-5 text-primary mt-0.5" /><div><div className="font-medium">Email</div><a href={`mailto:${data.email}`} className="text-muted-foreground hover:text-primary">{data.email}</a></div></div>)}
          {data?.phone && (<div className="flex gap-3"><Phone className="size-5 text-primary mt-0.5" /><div><div className="font-medium">Phone</div><a href={`tel:${data.phone}`} className="text-muted-foreground hover:text-primary">{data.phone}</a></div></div>)}
        </div>
        {data?.map_embed && (
          <div className="rounded-lg border overflow-hidden aspect-video">
            <iframe src={data.map_embed} className="w-full h-full" loading="lazy" />
          </div>
        )}
      </Section>
    </>
  );
}
