import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = { id: string; image_url: string; caption: string | null };

export function GallerySlider() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["gallery", "public"],
    queryFn: async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("id,image_url,caption")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      return (data ?? []) as GalleryImage[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("gallery_images_public")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_images" }, () => {
        qc.invalidateQueries({ queryKey: ["gallery", "public"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  const images = data ?? [];
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (index >= images.length && images.length > 0) setIndex(0);
  }, [images.length, index]);

  const go = (dir: 1 | -1) => {
    if (images.length === 0) return;
    setIndex((i) => (i + dir + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, images.length]);

  const manual = (dir: 1 | -1) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    go(dir);
  };

  if (images.length === 0) {
    return (
      <div className="rounded-lg border bg-secondary/40 p-12 text-center text-muted-foreground">
        No gallery images yet.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-black">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.image_url}
            alt={img.caption || "Gallery image"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {images[index]?.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <p className="text-sm md:text-base font-medium">{images[index].caption}</p>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={() => manual(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => manual(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    setIndex(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
