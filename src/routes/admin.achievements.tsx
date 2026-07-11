import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/achievements")({ component: () => (
  <CrudManager title="Achievements" table="achievements" fields={[
    { name: "title", label: "Title", type: "text", required: true },
    { name: "category", label: "Category", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "achievement_date", label: "Date", type: "date" },
    { name: "image_url", label: "Image", type: "image" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
