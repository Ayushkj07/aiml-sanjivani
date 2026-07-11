import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/student-council")({ component: () => (
  <CrudManager title="Student Council" table="student_council" fields={[
    { name: "name", label: "Name", type: "text", required: true },
    { name: "designation", label: "Designation", type: "text" },
    { name: "contact", label: "Contact", type: "text" },
    { name: "photo_url", label: "Photo", type: "image" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
