import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/news")({ component: () => (
  <CrudManager title="News" table="news" orderBy="published_at" orderAsc={false} fields={[
    { name: "title", label: "Title", type: "text", required: true },
    { name: "body", label: "Body", type: "textarea" },
    { name: "image_url", label: "Image", type: "image" },
    { name: "published_at", label: "Published at", type: "date" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
