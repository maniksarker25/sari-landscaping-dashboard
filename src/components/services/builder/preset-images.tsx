import * as React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Check, Image as ImageIcon } from "lucide-react";
import type { ServiceFormValues } from "@/lib/validations";

const PRESET_IMAGES = [
  { name: "Luxury Pools Cover", url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop" },
  { name: "Verdant Gardens", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop" },
  { name: "Evening Illuminations", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" },
  { name: "Backyard Majlis Lounge", url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop" },
  { name: "Modern Villa Exterior", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" }
];

export function PresetImages() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ServiceFormValues>();
  const featuredImage = watch("featuredImage");

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerMockUpload = (file: File) => {
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
              setValue("featuredImage", base64Data, { shouldValidate: true });
              setUploadProgress(null);
              toast.success(`Image "${file.name}" uploaded successfully!`);
            }, 150);
            return 100;
          }
          return prev + 20;
        });
      }, 60);
    };

    reader.onerror = () => {
      setUploadProgress(null);
      toast.error("Failed to read file.");
    };

    reader.readAsDataURL(file);
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
          triggerMockUpload(file);
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
          triggerMockUpload(file);
        } else {
          toast.error("Please select an image file.");
        }
      }
    }
  };

  const isPresetImage = PRESET_IMAGES.some(p => p.url === featuredImage);

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          Featured Thumbnail Image <span className="text-destructive">*</span>
        </Label>
        
        {/* Hidden input to hold state and integrate with React Hook Form validation */}
        <input
          type="hidden"
          {...register("featuredImage")}
        />

        {/* Drag & Drop uploader / Image Preview area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (uploadProgress === null) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
            featuredImage ? "aspect-video max-w-md w-full" : "p-8 text-center min-h-[160px]"
          } ${
            isDragging
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

          {uploadProgress !== null ? (
            <div className="w-full max-w-[240px] space-y-2 p-4" onClick={(e) => e.stopPropagation()}>
              <p className="text-xs font-medium text-foreground">Uploading image...</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-primary transition-all duration-150 animate-pulse"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground text-right">{uploadProgress}%</p>
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
                <UploadCloud className="h-8 w-8 text-white mb-1 animate-bounce" style={{ animationDuration: "3s" }} />
                <p className="text-white text-xs font-medium">Drop new image or click to replace</p>
                <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
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
                    onClick={() => setValue("featuredImage", "", { shouldValidate: true })}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Source Badge */}
              <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded text-[10px] font-medium border border-border shadow-sm">
                {isPresetImage ? "Preset Image" : "Uploaded File"}
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
          <p className="text-xs text-destructive font-medium mt-1">{errors.featuredImage.message}</p>
        )}
      </div>

      {/* Preset images selection grid */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          Or Select a Premium Preset
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PRESET_IMAGES.map((preset) => {
            const isSel = featuredImage === preset.url;
            return (
              <div
                key={preset.url}
                onClick={() => setValue("featuredImage", preset.url, { shouldValidate: true })}
                className={`group relative aspect-video overflow-hidden rounded-md border-2 bg-muted cursor-pointer transition-all duration-200 ${
                  isSel ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isSel && (
                  <div className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
