import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/faculty")({ component: () => (
  <CrudManager title="Faculty" table="faculty" fields={[
    { name: "name", label: "Name", type: "text", required: true },
    { name: "designation", label: "Designation", type: "text" },
    { name: "qualification", label: "Qualification", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "research_area", label: "Research Area", type: "text" },
    { name: "photo_url", label: "Photo", type: "image" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
