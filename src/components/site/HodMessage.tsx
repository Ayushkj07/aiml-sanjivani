import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HodContent = {
  title?: string;
  body?: string;
  image?: string;
  // legacy fields
  name?: string;
  designation?: string;
  qualification?: string;
  message?: string;
  photo_url?: string;
};

export const HOD_KEY = "hod";

export function useHodMessage() {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("hod-message-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content", filter: `key=eq.${HOD_KEY}` }, () => {
        qc.invalidateQueries({ queryKey: ["site_content", HOD_KEY] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);
  return useQuery({
    queryKey: ["site_content", HOD_KEY],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("value").eq("key", HOD_KEY).maybeSingle();
      if (error) throw error;
      return (data?.value ?? {}) as HodContent;
    },
  });
}

export function HodMessage() {
  const { data: hod = {} } = useHodMessage();
  const title = hod.title || hod.name || "HOD Message";
  const body = hod.body || hod.message || "";
  const image = hod.image || hod.photo_url || "";
  return (
    <div className={`rounded-lg border p-6 md:p-10 ${image ? "md:flex md:gap-8 md:items-start" : ""}`}>
      {image && <img src={image} alt={title} className="size-32 rounded-full object-cover mx-auto md:mx-0 shrink-0" />}
      <div className={`${image ? "mt-4 md:mt-0 text-center md:text-left" : ""} flex-1`}>
        <h3 className="text-xl font-bold">{title}</h3>
        {hod.designation && <p className="text-sm text-muted-foreground">{hod.designation}</p>}
        {hod.qualification && <p className="text-sm text-muted-foreground">{hod.qualification}</p>}
        {body && <p className="mt-4 text-muted-foreground whitespace-pre-line text-left">{body}</p>}
      </div>
    </div>
  );
}
