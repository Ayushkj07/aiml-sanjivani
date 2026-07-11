import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/gallery")({ component: () => (
  <CrudManager title="Gallery" table="gallery_images" fields={[
    { name: "image_url", label: "Image", type: "image", required: true },
    { name: "caption", label: "Caption", type: "text" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_visible", label: "Visible", type: "checkbox" },
  ]} />
) });
