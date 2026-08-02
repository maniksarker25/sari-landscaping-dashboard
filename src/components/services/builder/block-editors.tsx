import * as React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Waves,
  TreePalm,
  Hammer,
  Shield,
  Droplets,
  Flame,
  Sprout,
  Lightbulb,
  Info,
  UploadCloud,
  Check,
  Loader2,
} from "lucide-react";
import Tiptap from "@/components/common/Tiptap";
import type { ServiceFormValues } from "@/lib/validations";
import type {
  FeatureItem,
  GalleryItem,
  AccordionItem,
  TechnicalSpec,
} from "@/types";
import { fileRegistry } from "@/lib/file-registry";

// Presets for block icon selectors
const ICON_OPTIONS = [
  { name: "Waves", icon: Waves },
  { name: "TreePalm", icon: TreePalm },
  { name: "Sprout", icon: Sprout },
  { name: "Droplets", icon: Droplets },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Hammer", icon: Hammer },
  { name: "Shield", icon: Shield },
  { name: "Flame", icon: Flame },
];

interface EditorProps {
  index: number;
}

// 1. HERO SECTION EDITOR
export function HeroSectionEditor({ index }: EditorProps) {
  const { register } = useFormContext<ServiceFormValues>();

  return (
    <div className="space-y-4 pt-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            Hero Headline
          </Label>
          <Input
            placeholder="Headline text..."
            {...register(`sections.${index}.content.hero.headline` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            Hero Subheadline
          </Label>
          <Input
            placeholder="Brief subhead description..."
            {...register(`sections.${index}.content.hero.subheadline` as const)}
            className="h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Background Image URL
        </Label>
        <Input
          placeholder="https://..."
          {...register(`sections.${index}.content.hero.bgImage` as const)}
          className="h-10 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            CTA Button Label
          </Label>
          <Input
            placeholder="Get Free Quote"
            {...register(`sections.${index}.content.hero.ctaText` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            CTA Button Link
          </Label>
          <Input
            placeholder="/contact-us"
            {...register(`sections.${index}.content.hero.ctaLink` as const)}
            className="h-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// 2. RICH TEXT EDITOR
export function RichTextEditor({ index }: EditorProps) {
  const { setValue, watch } = useFormContext<ServiceFormValues>();
  const htmlContent = watch(`sections.${index}.content.richTextHtml`) || "";

  return (
    <div className="space-y-2.5 pt-3">
      <Label className="text-xs font-semibold text-muted-foreground">
        Description Rich Content
      </Label>
      <Tiptap
        content={htmlContent}
        setContent={(val) =>
          setValue(`sections.${index}.content.richTextHtml`, val, {
            shouldValidate: true,
          })
        }
      />
    </div>
  );
}

// 3. FEATURES GRID EDITOR
export function FeaturesGridEditor({ index }: EditorProps) {
  const { register, watch, setValue } = useFormContext<ServiceFormValues>();
  const features = watch(`sections.${index}.content.features`) || [];

  const handleAddFeature = () => {
    setValue(`sections.${index}.content.features`, [
      ...features,
      {
        title: "New Deliverable Title",
        description: "Deliverable description details...",
        iconUrl: "Waves",
      },
    ]);
  };

  const handleRemoveFeature = (idx: number) => {
    const next = features.filter((_, i: number) => i !== idx);
    setValue(`sections.${index}.content.features`, next);
  };

  const handleMoveFeature = (idx: number, dir: "up" | "down") => {
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === features.length - 1) return;

    const next = [...features];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    const temp = next[idx];
    if (temp && next[targetIdx]) {
      next[idx] = next[targetIdx]!;
      next[targetIdx] = temp;
      setValue(`sections.${index}.content.features`, next);
    }
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between border-b pb-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Features Checklist Items ({features.length})
        </Label>
        <Button
          type="button"
          size="sm"
          onClick={handleAddFeature}
          className="h-9 text-xs gap-1"
        >
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {features.map((feat: FeatureItem, idx: number) => (
          <div
            key={idx}
            className="rounded-lg border bg-muted/20 p-4 space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                ITEM #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={idx === 0}
                  onClick={() => handleMoveFeature(idx, "up")}
                  className="h-8 w-8"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={idx === features.length - 1}
                  onClick={() => handleMoveFeature(idx, "down")}
                  className="h-8 w-8"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFeature(idx)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Title
                </Label>
                <Input
                  {...register(
                    `sections.${index}.content.features.${idx}.title`,
                  )}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Icon
                </Label>
                <Select
                  value={feat.iconUrl || "Waves"}
                  onValueChange={(val) =>
                    setValue(
                      `sections.${index}.content.features.${idx}.iconUrl`,
                      val,
                    )
                  }
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Description
              </Label>
              <Input
                {...register(
                  `sections.${index}.content.features.${idx}.description`,
                )}
                className="h-10 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GalleryImagePickerProps {
  item: GalleryItem;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

function GalleryImagePicker({
  item,
  onFileSelect,
  onRemove,
}: GalleryImagePickerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fileInRegistry = item.uploadKey
    ? fileRegistry.get(item.uploadKey)
    : null;
  const attachedFile = item.file || fileInRegistry;

  // Local object URL preview for uploaded file with proper cleanup
  const [localPreviewUrl, setLocalPreviewUrl] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (attachedFile && attachedFile instanceof File) {
      const url = URL.createObjectURL(attachedFile);
      setLocalPreviewUrl(url);
      setIsProcessing(false);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setLocalPreviewUrl(null);
      setIsProcessing(false);
    }
  }, [attachedFile]);

  const displayUrl = localPreviewUrl || item.imageUrl || "";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFileSelect = (file: File) => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        onFileSelect(file);
      } catch (err) {
        console.error("Error processing gallery file:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        processFileSelect(file);
      } else {
        toast.error("Please drop an image file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        processFileSelect(file);
      } else {
        toast.error("Please select an image file.");
      }
    }
    // Clear value to release file input stream handle
    e.target.value = "";
  };

  return (
    <div className="space-y-1">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-md border border-dashed transition-all duration-200 cursor-pointer overflow-hidden h-28 w-full ${
          isProcessing
            ? "border-primary/50 bg-primary/5 cursor-wait"
            : isDragging
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : displayUrl
                ? "border-border bg-muted/10 hover:border-primary/50"
                : "border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center bg-background/80 backdrop-blur-xs w-full h-full">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-[10px] font-semibold text-foreground">
              Attaching Image...
            </span>
          </div>
        ) : displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="Gallery Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 p-2 text-center">
              <p className="text-white text-[10px] font-medium leading-tight">
                Click or drop to replace
              </p>
              <div
                className="flex gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-6 text-[9px] px-2 bg-white/90 text-foreground hover:bg-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-6 text-[9px] px-2"
                  onClick={onRemove}
                >
                  Remove
                </Button>
              </div>
            </div>
            <div className="absolute bottom-1.5 left-1.5 bg-background/90 backdrop-blur-sm text-foreground px-1.5 py-0.5 rounded text-[9px] font-medium border border-border shadow-sm">
              {attachedFile ? (
                <span className="text-emerald-500 font-bold truncate max-w-[120px] inline-block align-bottom">
                  {attachedFile.name}
                </span>
              ) : (
                "Saved Image"
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <UploadCloud className="mb-1 h-5 w-5 text-primary/70" />
            <p className="text-[11px] font-medium text-foreground">
              Add image{" "}
              <span className="text-primary font-semibold">browse</span>
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">
              JPG, PNG, WEBP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. GALLERY GRID EDITOR
export function GalleryGridEditor({ index }: EditorProps) {
  const { register, watch, setValue } = useFormContext<ServiceFormValues>();
  const gallery: GalleryItem[] =
    watch(`sections.${index}.content.gallery`) || [];

  const [isBatchProcessing, setIsBatchProcessing] = React.useState(false);
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const handleAddImage = () => {
    const uploadKey = `gallery-${index + 1}-img-${gallery.length + 1}-${Date.now()}`;
    setValue(`sections.${index}.content.gallery`, [
      ...gallery,
      {
        uploadKey,
        imageUrl: "",
        caption: "Gallery Image Caption",
        altText: "Alt Text",
      },
    ]);
  };

  const handleRemoveImage = (idx: number) => {
    const item = gallery[idx];
    if (item?.uploadKey) {
      fileRegistry.delete(item.uploadKey);
    }
    const next = gallery.filter((_, i: number) => i !== idx);
    setValue(`sections.${index}.content.gallery`, next);
  };

  const handleFileSelect = (idx: number, file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `Gallery image "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Maximum allowed size is 5 MB.`,
      );
      return;
    }
    const item = gallery[idx];
    const uploadKey =
      item?.uploadKey || `gallery-${index + 1}-img-${idx + 1}-${Date.now()}`;

    // Store binary File object in fileRegistry outside RHF state tree to prevent freeze
    fileRegistry.set(uploadKey, file);

    const previewUrl = URL.createObjectURL(file);

    const updated = [...gallery];
    updated[idx] = {
      ...item,
      uploadKey,
      imageUrl: previewUrl,
      caption: item?.caption || file.name.replace(/\.[^/.]+$/, ""),
      altText: item?.altText || file.name,
    };
    setValue(`sections.${index}.content.gallery`, updated);
    toast.success(`Attached "${file.name}" for upload.`);
  };

  const handleBatchDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setIsBatchProcessing(true);
      setTimeout(() => {
        try {
          const validFiles: File[] = [];
          Array.from(files).forEach((file) => {
            if (file.type.startsWith("image/")) {
              if (file.size <= MAX_FILE_SIZE_BYTES) {
                validFiles.push(file);
              } else {
                toast.error(`"${file.name}" exceeds 5 MB limit.`);
              }
            }
          });

          if (validFiles.length > 0) {
            const newItems: GalleryItem[] = validFiles.map((file, i) => {
              const uploadKey = `gallery-${index + 1}-img-${gallery.length + i + 1}-${Date.now()}`;
              fileRegistry.set(uploadKey, file);
              const previewUrl = URL.createObjectURL(file);
              return {
                uploadKey,
                imageUrl: previewUrl,
                caption: file.name.replace(/\.[^/.]+$/, ""),
                altText: file.name,
              };
            });

            setValue(`sections.${index}.content.gallery`, [
              ...gallery,
              ...newItems,
            ]);
            toast.success(`Added ${validFiles.length} image(s) to gallery.`);
          }
        } catch (err) {
          console.error("Error batch processing gallery files:", err);
        } finally {
          setIsBatchProcessing(false);
        }
      }, 150);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between border-b pb-2">
        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <UploadCloud className="h-3.5 w-3.5 text-primary" />
          Gallery Showcase Images ({gallery.length})
        </Label>
        <Button
          type="button"
          size="sm"
          onClick={handleAddImage}
          className="h-8 text-xs gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add Image
        </Button>
      </div>

      {isBatchProcessing ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs font-semibold text-foreground">
            Processing gallery images...
          </p>
        </div>
      ) : gallery.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleBatchDrop}
          onClick={handleAddImage}
          className="rounded-lg border-2 border-dashed border-border p-6 text-center bg-muted/10 hover:bg-muted/20 hover:border-primary/40 cursor-pointer transition-colors space-y-1.5"
        >
          <UploadCloud className="h-7 w-7 text-muted-foreground/60 mx-auto" />
          <p className="text-xs font-semibold text-foreground">
            No gallery images added yet
          </p>
          <p className="text-[10px] text-muted-foreground">
            Click here, or drag & drop multiple image files to build your
            gallery grid.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 max-h-[420px] overflow-y-auto pr-1">
          {gallery.map((img: GalleryItem, idx: number) => {
            return (
              <div
                key={idx}
                className="rounded-lg border bg-muted/10 p-3 space-y-2 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Image #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(idx)}
                    className="h-6 w-6 text-destructive hover:bg-destructive/10"
                    title="Remove image item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Compact Image Picker */}
                <GalleryImagePicker
                  item={img}
                  onFileSelect={(file) => handleFileSelect(idx, file)}
                  onRemove={() => handleRemoveImage(idx)}
                />

                <div className="space-y-1.5 pt-1">
                  <div>
                    <Label className="text-[10px] font-medium text-muted-foreground">
                      Caption
                    </Label>
                    <Input
                      {...register(
                        `sections.${index}.content.gallery.${idx}.caption`,
                      )}
                      placeholder="Caption..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-medium text-muted-foreground">
                      Alt Text
                    </Label>
                    <Input
                      {...register(
                        `sections.${index}.content.gallery.${idx}.altText`,
                      )}
                      placeholder="Alt text..."
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 5. FAQ ACCORDION EDITOR
export function FaqAccordionEditor({ index }: EditorProps) {
  const { register, watch, setValue } = useFormContext<ServiceFormValues>();
  const accordions = watch(`sections.${index}.content.accordionItems`) || [];

  const handleAddFaq = () => {
    setValue(`sections.${index}.content.accordionItems`, [
      ...accordions,
      { question: "FAQ Question?", answer: "FAQ Answer text goes here..." },
    ]);
  };

  const handleRemoveFaq = (idx: number) => {
    const next = accordions.filter((_, i: number) => i !== idx);
    setValue(`sections.${index}.content.accordionItems`, next);
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between border-b pb-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          FAQ Accordion Items ({accordions.length})
        </Label>
        <Button
          type="button"
          size="sm"
          onClick={handleAddFaq}
          className="h-9 text-xs gap-1"
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {accordions.map((_: AccordionItem, idx: number) => (
          <div
            key={idx}
            className="rounded-lg border bg-muted/20 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                FAQ #{idx + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFaq(idx)}
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Question
              </Label>
              <Input
                {...register(
                  `sections.${index}.content.accordionItems.${idx}.question`,
                )}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Answer
              </Label>
              <Textarea
                rows={3}
                {...register(
                  `sections.${index}.content.accordionItems.${idx}.answer`,
                )}
                className="text-sm resize-none min-h-[80px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. CTA BANNER EDITOR
export function CtaBannerEditor({ index }: EditorProps) {
  const { register } = useFormContext<ServiceFormValues>();

  return (
    <div className="space-y-4 pt-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            CTA Banner Title
          </Label>
          <Input
            placeholder="e.g. Start Your Dream Project Today"
            {...register(`sections.${index}.content.cta.title` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            Phone Number Link
          </Label>
          <Input
            placeholder="+971 50 123 4567"
            {...register(`sections.${index}.content.cta.phoneNumber` as const)}
            className="h-10 text-sm"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">
          Description Text
        </Label>
        <Textarea
          rows={3}
          placeholder="Brief copy for banner..."
          {...register(`sections.${index}.content.cta.description` as const)}
          className="text-sm resize-none min-h-[80px]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            Button Text
          </Label>
          <Input
            placeholder="Contact Us"
            {...register(`sections.${index}.content.cta.buttonText` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            Button Link
          </Label>
          <Input
            placeholder="/contact-us"
            {...register(`sections.${index}.content.cta.buttonLink` as const)}
            className="h-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// 7. TECHNICAL SPECS EDITOR
export function TechnicalSpecsEditor({ index }: EditorProps) {
  const { register, watch, setValue } = useFormContext<ServiceFormValues>();
  const specs = watch(`sections.${index}.content.specs`) || [];

  const handleAddSpec = () => {
    setValue(`sections.${index}.content.specs`, [
      ...specs,
      { label: "Spec Label Name", value: "Spec Value Description" },
    ]);
  };

  const handleRemoveSpec = (idx: number) => {
    const next = specs.filter((_, i: number) => i !== idx);
    setValue(`sections.${index}.content.specs`, next);
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between border-b pb-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Technical Specifications ({specs.length})
        </Label>
        <Button
          type="button"
          size="sm"
          onClick={handleAddSpec}
          className="h-9 text-xs gap-1"
        >
          <Plus className="h-4 w-4" /> Add Spec
        </Button>
      </div>

      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {specs.map((_: TechnicalSpec, idx: number) => (
          <div key={idx} className="flex gap-3 items-end">
            <div className="flex-1 grid gap-3 grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Spec Label
                </Label>
                <Input
                  {...register(`sections.${index}.content.specs.${idx}.label`)}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Value
                </Label>
                <Input
                  {...register(`sections.${index}.content.specs.${idx}.value`)}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveSpec(idx)}
              className="h-10 w-10 text-destructive hover:bg-destructive/10 shrink-0"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
