import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/events")({ component: () => (
  <CrudManager title="Events" table="events" fields={[
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "event_date", label: "Event date", type: "date" },
    { name: "venue", label: "Venue", type: "text" },
    { name: "poster_url", label: "Poster image", type: "image" },
    { name: "registration_url", label: "Registration link (URL)", type: "url", placeholder: "https://forms.google.com/... or any registration site" },
    { name: "registration_button_text", label: "Button text", type: "text", placeholder: "Apply Now" },
    { name: "registration_deadline", label: "Registration deadline (optional)", type: "date" },
    { name: "registration_enabled", label: "Enable registration button", type: "checkbox" },
    { name: "open_in_new_tab", label: "Open registration link in new tab", type: "checkbox" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible on public site", type: "checkbox" },
  ]} />
) });
