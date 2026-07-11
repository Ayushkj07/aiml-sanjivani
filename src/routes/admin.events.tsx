import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/events")({ component: () => (
  <CrudManager title="Events" table="events" fields={[
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "event_date", label: "Event date", type: "date" },
    { name: "venue", label: "Venue", type: "text" },
    { name: "poster_url", label: "Poster image", type: "image" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible on public site", type: "checkbox" },
  ]} />
) });
