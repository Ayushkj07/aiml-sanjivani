import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/research")({ component: () => (
  <CrudManager title="Research" table="research" fields={[
    { name: "title", label: "Title", type: "text", required: true },
    { name: "authors", label: "Authors", type: "text" },
    { name: "research_type", label: "Type", type: "select", options: [
      { value: "paper", label: "Paper" }, { value: "publication", label: "Publication" }, { value: "patent", label: "Patent" },
    ] },
    { name: "year", label: "Year", type: "number" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "link_url", label: "External link", type: "text" },
    { name: "file_url", label: "PDF file", type: "file", accept: ".pdf" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
