import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Image as ImageIcon, Waves, Trees, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGalleryStore } from "@/lib/content-stores";
import type { GalleryImage } from "@/types";
import { GalleryFormDialog } from "@/pages/gallery/gallery-form-dialog";

export default function GalleryPage() {
  const items = useGalleryStore((s) => s.items);
  const remove = useGalleryStore((s) => s.remove);

  const [activeCategory, setActiveCategory] = React.useState<
    GalleryImage["category"] | "all"
  >("all");
  const [formState, setFormState] = React.useState<{
    open: boolean;
    image?: GalleryImage;
  }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<GalleryImage | null>(
    null
  );

  const counts = React.useMemo(() => {
    return {
      all: items.length,
      pools: items.filter((img) => img.category === "pools").length,
      landscaping: items.filter((img) => img.category === "landscaping").length,
    };
  }, [items]);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((img) => img.category === activeCategory);

  function handleDelete(image: GalleryImage) {
    remove(image.id);
    toast.success("Image removed from gallery");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Manage the Pools and Landscaping photo gallery shown on your website."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Image
          </Button>
        }
      />

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={(val) => setActiveCategory(val as GalleryImage["category"] | "all")}
        className="w-full"
      >
        <TabsList className="h-11 bg-muted/60 p-1">
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
          >
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            <span>All</span>
            <Badge
              variant={activeCategory === "all" ? "default" : "outline"}
              className="ml-1 px-2 py-0 text-[11px] font-semibold"
            >
              {counts.all}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="pools"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
          >
            <Waves className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>Pools</span>
            <Badge
              variant={activeCategory === "pools" ? "default" : "outline"}
              className="ml-1 px-2 py-0 text-[11px] font-semibold"
            >
              {counts.pools}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="landscaping"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
          >
            <Trees className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Landscaping</span>
            <Badge
              variant={activeCategory === "landscaping" ? "default" : "outline"}
              className="ml-1 px-2 py-0 text-[11px] font-semibold"
            >
              {counts.landscaping}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Gallery Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images in this category"
          description="Add an image or choose a different category."
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Image
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((image) => {
            const isPool = image.category === "pools";
            return (
              <div
                key={image.id}
                className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                {/* Image */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Category Badge Pill */}
                <div className="absolute left-2 top-2 z-10">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-sm backdrop-blur-md ${
                      isPool
                        ? "bg-sky-500/90 text-white"
                        : "bg-emerald-600/90 text-white"
                    }`}
                  >
                    {isPool ? (
                      <Waves className="h-3 w-3" />
                    ) : (
                      <Trees className="h-3 w-3" />
                    )}
                    <span className="capitalize">{image.category}</span>
                  </span>
                </div>

                {/* Hover Overlay & Actions */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between bg-black/50 p-2.5 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setFormState({ open: true, image })}
                      aria-label="Edit image"
                      className="h-7 w-7 rounded-full bg-white/90 text-foreground hover:bg-white dark:bg-zinc-800/90 dark:text-zinc-100 dark:hover:bg-zinc-800 shadow-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeleteTarget(image)}
                      aria-label="Delete image"
                      className="h-7 w-7 rounded-full shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <p className="line-clamp-2 text-[11px] font-medium text-white/90 drop-shadow-sm">
                    {image.alt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form & Delete Dialogs */}
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
