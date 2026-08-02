import * as React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import type { ServiceFormValues } from "@/lib/validations";
import { fileRegistry } from "@/lib/file-registry";

export function PresetImages() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ServiceFormValues>();
  const featuredImage = watch("featuredImage");

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [uploadProgress] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const handleFileSelectInternal = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `Image "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Maximum allowed size is 5 MB.`,
      );
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      try {
        // Store raw binary file in fileRegistry outside RHF state tree
        fileRegistry.set("featuredImageFile", file);

        const previewUrl = URL.createObjectURL(file);
        setValue("featuredImage", previewUrl);
        toast.success(`Attached "${file.name}" as featured image.`);
      } catch (err) {
        console.error("Error setting featured image:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          handleFileSelectInternal(file);
        } else {
          toast.error("Please drop an image file.");
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          handleFileSelectInternal(file);
        } else {
          toast.error("Please select an image file.");
        }
      }
    }
    // Clear value to release file input stream handle
    e.target.value = "";
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          Featured Thumbnail Image <span className="text-destructive">*</span>
        </Label>

        {/* Hidden input to hold state and integrate with React Hook Form validation */}
        <input type="hidden" {...register("featuredImage")} />

        {/* Drag & Drop uploader / Image Preview area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (uploadProgress === null && !isProcessing) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
            featuredImage
              ? "aspect-video max-w-md w-full"
              : "p-8 text-center min-h-[160px]"
          } ${
            isProcessing
              ? "border-primary/50 bg-primary/5 cursor-wait"
              : isDragging
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/30"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs font-semibold text-foreground">
                Attaching image...
              </p>
            </div>
          ) : uploadProgress !== null ? (
            <div
              className="w-full max-w-[240px] space-y-2 p-4"
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
          ) : featuredImage ? (
            <>
              {/* Loaded Image View */}
              <img
                src={featuredImage}
                alt="Featured Thumbnail Preview"
                className="h-full w-full object-cover"
              />

              {/* Blur-overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                <UploadCloud
                  className="h-8 w-8 text-white mb-1 animate-bounce"
                  style={{ animationDuration: "3s" }}
                />
                <p className="text-white text-xs font-medium">
                  Drop new image or click to replace
                </p>
                <div
                  className="flex gap-2 mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
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
                    onClick={() => {
                      fileRegistry.delete("featuredImageFile");
                      setValue("featuredImage", "");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="mb-2 h-9 w-9 text-muted-foreground/60 transition-transform duration-200" />
              <p className="text-xs font-medium text-foreground">
                Drag & drop image here, or{" "}
                <span className="text-primary font-semibold">browse files</span>
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Supports JPG, PNG, WEBP, or GIF from your device
              </p>
            </div>
          )}
        </div>

        {errors.featuredImage && (
          <p className="text-xs text-destructive font-medium mt-1">
            {errors.featuredImage.message}
          </p>
        )}
      </div>
    </div>
  );
}
