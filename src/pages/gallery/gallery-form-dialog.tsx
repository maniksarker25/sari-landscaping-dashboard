import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { galleryFormSchema, type GalleryFormValues } from "@/lib/validations";
import { useGalleryStore } from "@/lib/content-stores";
import { generateId } from "@/lib/utils";
import type { GalleryImage } from "@/types";

interface GalleryFormDialogProps {
  open: boolean;
  image?: GalleryImage;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels: Record<GalleryFormValues["category"], string> = {
  pools: "Pools",
  landscaping: "Landscaping",
  "outdoor-living": "Outdoor Living",
  lighting: "Lighting",
};

export function GalleryFormDialog({ open, image, onOpenChange }: GalleryFormDialogProps) {
  const add = useGalleryStore((s) => s.add);
  const update = useGalleryStore((s) => s.update);
  const isEditing = !!image;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: { src: "", alt: "", category: "pools" },
  });

  React.useEffect(() => {
    if (open) {
      reset(image ? { src: image.src, alt: image.alt, category: image.category } : { src: "", alt: "", category: "pools" });
    }
  }, [open, image, reset]);

  const category = watch("category");
  const src = watch("src");

  async function onSubmit(values: GalleryFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (isEditing && image) {
      update(image.id, { ...values, updatedAt: new Date().toISOString() });
      toast.success("Image updated");
    } else {
      add({ id: generateId("img"), ...values, updatedAt: new Date().toISOString() });
      toast.success("Image added to gallery");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Image" : "Add Image"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this gallery image." : "Add a new image to the gallery."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="src">Image URL</Label>
            <Input id="src" placeholder="https://..." {...register("src")} />
            {errors.src && <p className="text-xs text-destructive">{errors.src.message}</p>}
          </div>

          {src && !errors.src && (
            <div className="aspect-video w-full overflow-hidden rounded-md border border-border bg-muted">
              <img src={src} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="alt">Alt text</Label>
            <Input id="alt" placeholder="Describe the image for accessibility & SEO" {...register("alt")} />
            {errors.alt && <p className="text-xs text-destructive">{errors.alt.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value) => setValue("category", value as GalleryFormValues["category"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Save changes" : "Add image"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
