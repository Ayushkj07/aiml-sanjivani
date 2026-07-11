import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/placements")({ component: () => (
  <CrudManager title="Placements" table="placements" fields={[
    { name: "student_name", label: "Student name", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "package", label: "Package", type: "text" },
    { name: "year", label: "Year", type: "number" },
    { name: "company_logo_url", label: "Company logo", type: "image" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
