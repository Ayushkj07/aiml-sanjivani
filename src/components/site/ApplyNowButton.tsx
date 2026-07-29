import { useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";

type EventLike = {
  registration_url?: string | null;
  registration_button_text?: string | null;
  registration_deadline?: string | null;
  registration_enabled?: boolean | null;
  open_in_new_tab?: boolean | null;
};

export function isRegistrationClosed(deadline?: string | null) {
  if (!deadline) return false;
  const end = new Date(deadline);
  end.setHours(23, 59, 59, 999);
  return Date.now() > end.getTime();
}

export function hasRegistration(e: EventLike) {
  return !!(e.registration_enabled && e.registration_url && e.registration_url.trim());
}

export function ApplyNowButton({ event, size = "md", className = "" }: { event: EventLike; size?: "sm" | "md"; className?: string }) {
  const [loading, setLoading] = useState(false);
  if (!hasRegistration(event)) return null;
  const closed = isRegistrationClosed(event.registration_deadline);
  const label = event.registration_button_text?.trim() || "Apply Now";
  const newTab = event.open_in_new_tab !== false;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 " +
    "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const sizes = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  if (closed) {
    return (
      <span className={`${base} ${sizes} bg-muted text-muted-foreground cursor-not-allowed ${className}`}>
        Registrations Closed
      </span>
    );
  }
  return (
    <a
      href={event.registration_url!}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        e.stopPropagation();
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1200);
      }}
      className={`${base} ${sizes} bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <ExternalLink className="size-4" />}
      {label}
    </a>
  );
}

export function RegistrationBadge({ event }: { event: EventLike }) {
  if (!hasRegistration(event)) return null;
  const closed = isRegistrationClosed(event.registration_deadline);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        closed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
      }`}
    >
      <span className={`size-1.5 rounded-full ${closed ? "bg-muted-foreground" : "bg-primary animate-pulse"}`} />
      {closed ? "Registrations Closed" : "Registrations Open"}
    </span>
  );
}
