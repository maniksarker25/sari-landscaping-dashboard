import * as React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Check } from "lucide-react";
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

  const triggerMockUpload = (fileName: string) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const randomImg = PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)]?.url || "";
            setValue("featuredImage", randomImg, { shouldValidate: true });
            setUploadProgress(null);
            toast.success(`Image "${fileName}" uploaded successfully!`);
          }, 200);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
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
          triggerMockUpload(file.name);
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
        triggerMockUpload(file.name);
      }
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label htmlFor="featuredImage" className="text-xs font-semibold text-muted-foreground">
          Featured Thumbnail Image URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="featuredImage"
          placeholder="https://images.unsplash.com/..."
          {...register("featuredImage")}
          className="h-10 text-sm"
        />
        {errors.featuredImage && (
          <p className="text-xs text-destructive">{errors.featuredImage.message}</p>
        )}
      </div>

      {/* Drag & Drop uploader area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
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
          <div className="w-full max-w-[240px] space-y-2" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-medium text-foreground">Uploading image...</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-primary transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <UploadCloud className="mb-2 h-9 w-9 text-muted-foreground/60" />
            <p className="text-xs font-medium text-foreground">
              Drag & drop image here, or{" "}
              <span className="text-primary font-semibold">browse files</span>
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Simulates secure upload to cloud server
            </p>
          </>
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
                  isSel ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-85 hover:opacity-100"
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
