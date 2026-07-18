import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGalleryStore } from "@/lib/content-stores";
import type { GalleryImage } from "@/types";
import { GalleryFormDialog } from "@/pages/gallery/gallery-form-dialog";

const categories: { label: string; value: GalleryImage["category"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pools", value: "pools" },
  { label: "Landscaping", value: "landscaping" },
  { label: "Outdoor Living", value: "outdoor-living" },
  { label: "Lighting", value: "lighting" },
];

export default function GalleryPage() {
  const items = useGalleryStore((s) => s.items);
  const remove = useGalleryStore((s) => s.remove);

  const [activeCategory, setActiveCategory] = React.useState<GalleryImage["category"] | "all">("all");
  const [formState, setFormState] = React.useState<{ open: boolean; image?: GalleryImage }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<GalleryImage | null>(null);

  const filtered = activeCategory === "all" ? items : items.filter((img) => img.category === activeCategory);

  function handleDelete(image: GalleryImage) {
    remove(image.id);
    toast.success("Image removed from gallery");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Manage the photo gallery shown on your website."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4" /> Add Image
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => setActiveCategory(category.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              activeCategory === category.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary/10"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images in this category"
          description="Add an image or choose a different category."
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4" /> Add Image
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              <div className="absolute left-2 top-2">
                <Badge variant="secondary" className="capitalize">
                  {image.category.replace("-", " ")}
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button size="icon" variant="secondary" onClick={() => setFormState({ open: true, image })} aria-label="Edit image">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={() => setDeleteTarget(image)} aria-label="Delete image">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <GalleryFormDialog
        open={formState.open}
        image={formState.image}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this image?"
        description="This will permanently remove the image from your gallery."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
