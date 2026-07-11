import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/downloads")({ component: () => (
  <CrudManager title="Downloads" table="downloads" fields={[
    { name: "title", label: "Title", type: "text", required: true },
    { name: "category", label: "Category", type: "select", required: true, options: [
      { value: "syllabus", label: "Syllabus" }, { value: "form", label: "Form" },
      { value: "calendar", label: "Academic Calendar" }, { value: "timetable", label: "Time Table" }, { value: "circular", label: "Circular" },
    ] },
    { name: "description", label: "Description", type: "textarea" },
    { name: "file_url", label: "File", type: "file" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
