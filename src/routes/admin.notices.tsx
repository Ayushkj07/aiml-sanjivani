import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/notices")({ component: () => (
  <CrudManager title="Notices" table="notices" orderBy="published_at" orderAsc={false} fields={[
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "file_url", label: "PDF file", type: "file", accept: ".pdf" },
    { name: "published_at", label: "Published at", type: "date" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
