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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { galleryFormSchema, type GalleryFormValues } from "@/lib/validations";
import { useGalleryStore } from "@/lib/content-stores";
import { generateId } from "@/lib/utils";
import type { GalleryImage } from "@/types";
import { UploadCloud, Check } from "lucide-react";

const PRESET_GALLERY_IMAGES = [
  { name: "Luxury Pool", url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop" },
  { name: "Verdant Garden", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop" },
  { name: "Evening Lighting", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" },
  { name: "Backyard Lounge", url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop" },
];

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

export function GalleryFormDialog({
  open,
  image,
  onOpenChange,
}: GalleryFormDialogProps) {
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
      reset(
        image
          ? { src: image.src, alt: image.alt, category: image.category }
          : { src: "", alt: "", category: "pools" },
      );
    }
  }, [open, image, reset]);

  const category = watch("category");
  const src = watch("src");

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setUploadProgress(0);
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null) return null;
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setValue("src", base64Data, { shouldValidate: true });
              setUploadProgress(null);
              toast.success(`Image "${file.name}" uploaded successfully!`);
            }, 150);
            return 100;
          }
          return prev + 25;
        });
      }, 50);
    };

    reader.onerror = () => {
      setUploadProgress(null);
      toast.error("Failed to read file.");
    };

    reader.readAsDataURL(file);
  };

  async function onSubmit(values: GalleryFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (isEditing && image) {
      update(image.id, { ...values, updatedAt: new Date().toISOString() });
      toast.success("Image updated");
    } else {
      add({
        id: generateId("img"),
        ...values,
        updatedAt: new Date().toISOString(),
      });
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
            {isEditing
              ? "Update this gallery image."
              : "Add a new image to the gallery."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <input type="hidden" {...register("src")} />

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <UploadCloud className="h-3.5 w-3.5" />
              Gallery Image <span className="text-destructive">*</span>
            </Label>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = e.dataTransfer.files;
                if (files && files[0] && files[0].type.startsWith("image/")) {
                  handleFileUpload(files[0]);
                } else {
                  toast.error("Please drop an image file.");
                }
              }}
              onClick={() => {
                if (uploadProgress === null) fileInputRef.current?.click();
              }}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
                src ? "aspect-video max-w-full w-full" : "p-4 text-center min-h-[120px]"
              } ${
                isDragging
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/30"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              {uploadProgress !== null ? (
                <div className="w-full max-w-[200px] space-y-2 p-3" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-medium text-foreground">Uploading image...</p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full bg-primary transition-all duration-150 animate-pulse"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right">{uploadProgress}%</p>
                </div>
              ) : src ? (
                <>
                  <img src={src} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <p className="text-white text-xs font-medium">Drop new image or click to replace</p>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 text-[10px] px-2.5 bg-white/90 text-foreground hover:bg-white"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Replace Image
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-7 text-[10px] px-2.5"
                        onClick={() => setValue("src", "", { shouldValidate: true })}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded text-[10px] font-medium border border-border shadow-sm">
                    {PRESET_GALLERY_IMAGES.some((p) => p.url === src) ? "Preset Image" : "Uploaded File"}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-2">
                  <UploadCloud className="mb-1 h-7 w-7 text-muted-foreground/60" />
                  <p className="text-xs font-medium text-foreground">
                    Drag & drop image, or <span className="text-primary font-semibold">browse files</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Supports JPG, PNG, WEBP, or GIF</p>
                </div>
              )}
            </div>

            {/* Presets Strip */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Or Select Preset
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_GALLERY_IMAGES.map((preset) => {
                  const isSel = src === preset.url;
                  return (
                    <div
                      key={preset.url}
                      onClick={() => setValue("src", preset.url, { shouldValidate: true })}
                      className={`group relative aspect-video overflow-hidden rounded-md border-2 bg-muted cursor-pointer transition-all duration-200 ${
                        isSel ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                      {isSel && (
                        <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {errors.src && <p className="text-xs text-destructive font-medium">{errors.src.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt">Alt text</Label>
            <Input
              id="alt"
              placeholder="Describe the image for accessibility & SEO"
              {...register("alt")}
            />
            {errors.alt && (
              <p className="text-xs text-destructive">{errors.alt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Service</Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setValue("category", value as GalleryFormValues["category"])
              }
            >
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
