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
import type { GalleryImage } from "@/types";
import { UploadCloud } from "lucide-react";
import {
  useUploadGalleryMutation,
  useUpdateGalleryMutation,
} from "@/redux/services/galleryApis";

interface GalleryFormDialogProps {
  open: boolean;
  image?: GalleryImage;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels: Record<GalleryFormValues["category"], string> = {
  pools: "Pools",
  landscaping: "Landscaping",
};

export function GalleryFormDialog({
  open,
  image,
  onOpenChange,
}: GalleryFormDialogProps) {
  const isEditing = !!image;

  const [uploadGallery, { isLoading: isUploading }] =
    useUploadGalleryMutation();
  const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: { src: "", alt: "", category: "pools", location: "" },
  });

  React.useEffect(() => {
    if (open) {
      setSelectedFile(null);
      reset(
        image
          ? {
              src: image.src,
              alt: image.alt,
              category: image.category,
              location: image.location || "",
            }
          : { src: "", alt: "", category: "pools", location: "" },
      );
    }
  }, [open, image, reset]);

  const category = watch("category");
  const src = watch("src");

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(
    null,
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
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
    try {
      const categoryFormatted =
        values.category.charAt(0).toUpperCase() + values.category.slice(1);

      const data = {
        location: values.location || "",
        imageAlt: values.alt,
        category: categoryFormatted,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (selectedFile instanceof File) {
        formData.append("image", selectedFile);
      }

      if (isEditing && image) {
        await updateGallery({ id: image.id, data: formData }).unwrap();
        toast.success("Image updated successfully");
      } else {
        await uploadGallery(formData).unwrap();
        toast.success("Image added to gallery");
      }
      onOpenChange(false);
    } catch (error: any) {
      // console.error("Gallery submit error:", error);
      toast.error(
        error?.data?.message ||
          "An error occurred while saving the gallery item.",
      );
    }
  }

  const isPending = isSubmitting || isUploading || isUpdating;

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
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
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
                src
                  ? "aspect-video max-w-full w-full"
                  : "p-4 text-center min-h-[120px]"
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
                <div
                  className="w-full max-w-[200px] space-y-2 p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs font-medium text-foreground">
                    Uploading image...
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full bg-primary transition-all duration-150 animate-pulse"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right">
                    {uploadProgress}%
                  </p>
                </div>
              ) : src ? (
                <>
                  <img
                    src={src}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <p className="text-white text-xs font-medium">
                      Drop new image or click to replace
                    </p>
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 text-[10px] px-2.5 bg-white/90 text-black hover:bg-white"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Replace Image
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-7 text-[10px] px-2.5"
                        onClick={() => {
                          setValue("src", "", { shouldValidate: true });
                          setSelectedFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded text-[10px] font-medium border border-border shadow-sm">
                    Uploaded File
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-2">
                  <UploadCloud className="mb-1 h-7 w-7 text-muted-foreground/60" />
                  <p className="text-xs font-medium text-foreground">
                    Drag & drop image, or{" "}
                    <span className="text-primary font-semibold">
                      browse files
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Supports JPG, PNG, WEBP, or GIF
                  </p>
                </div>
              )}
            </div>

            {errors.src && (
              <p className="text-xs text-destructive font-medium">
                {errors.src.message}
              </p>
            )}
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
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Dubai"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-xs text-destructive">
                {errors.location.message}
              </p>
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
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Add image"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
