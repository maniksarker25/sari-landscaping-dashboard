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
} from "lucide-react";
import Tiptap from "@/components/common/Tiptap";
import type { ServiceFormValues } from "@/lib/validations";
import type { FeatureItem, GalleryItem, AccordionItem, TechnicalSpec } from "@/types";

// Presets for block icon selectors
const ICON_OPTIONS = [
  { name: "Waves", icon: Waves },
  { name: "TreePalm", icon: TreePalm },
  { name: "Sprout", icon: Sprout },
  { name: "Droplets", icon: Droplets },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Hammer", icon: Hammer },
  { name: "Shield", icon: Shield },
  { name: "Flame", icon: Flame }
];

interface EditorProps {
  index: number;
}

// 1. HERO SECTION EDITOR
export function HeroSectionEditor({ index }: EditorProps) {
  const { register, setValue } = useFormContext<ServiceFormValues>();

  const [simulatedProgress, setSimulatedProgress] = React.useState<number>(0);
  const [simulatingUpload, setSimulatingUpload] = React.useState(false);

  const startMockBgUpload = () => {
    setSimulatingUpload(true);
    setSimulatedProgress(0);
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const randomPools = [
              "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop"
            ];
            const randomImg = randomPools[Math.floor(Math.random() * randomPools.length)] || "";
            setValue(`sections.${index}.content.hero.bgImage`, randomImg, { shouldValidate: true });
            setSimulatingUpload(false);
            toast.success("Mock hero background upload complete!");
          }, 200);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Hero Headline</Label>
          <Input
            placeholder="Headline text..."
            {...register(`sections.${index}.content.hero.headline` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Hero Subheadline</Label>
          <Input
            placeholder="Brief subhead description..."
            {...register(`sections.${index}.content.hero.subheadline` as const)}
            className="h-10 text-sm"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">Background Image URL</Label>
        <Input
          placeholder="https://..."
          {...register(`sections.${index}.content.hero.bgImage` as const)}
          className="h-10 text-sm"
        />
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={simulatingUpload}
            onClick={startMockBgUpload}
            className="text-xs h-9"
          >
            {simulatingUpload ? `Uploading (${simulatedProgress}%)` : "Simulate BG Upload"}
          </Button>
          <span className="text-[10px] text-muted-foreground">Selects high-res landscaping/pool view</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">CTA Button Label</Label>
          <Input
            placeholder="Get Free Quote"
            {...register(`sections.${index}.content.hero.ctaText` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">CTA Button Link</Label>
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
      <Label className="text-xs font-semibold text-muted-foreground">Description Rich Content</Label>
      <Tiptap
        content={htmlContent}
        setContent={(val) => setValue(`sections.${index}.content.richTextHtml`, val, { shouldValidate: true })}
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
      { title: "New Deliverable Title", description: "Deliverable description details...", iconUrl: "Waves" }
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
        <Label className="text-xs font-semibold text-muted-foreground">Features Checklist Items ({features.length})</Label>
        <Button type="button" size="sm" onClick={handleAddFeature} className="h-9 text-xs gap-1">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {features.map((feat: FeatureItem, idx: number) => (
          <div key={idx} className="rounded-lg border bg-muted/20 p-4 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">ITEM #{idx + 1}</span>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" disabled={idx === 0} onClick={() => handleMoveFeature(idx, "up")} className="h-8 w-8"><ArrowUp className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" disabled={idx === features.length - 1} onClick={() => handleMoveFeature(idx, "down")} className="h-8 w-8"><ArrowDown className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFeature(idx)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Title</Label>
                <Input {...register(`sections.${index}.content.features.${idx}.title`)} className="h-10 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Icon</Label>
                <Select
                  value={feat.iconUrl || "Waves"}
                  onValueChange={(val) => setValue(`sections.${index}.content.features.${idx}.iconUrl`, val)}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(opt => (
                      <SelectItem key={opt.name} value={opt.name}>{opt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
              <Input {...register(`sections.${index}.content.features.${idx}.description`)} className="h-10 text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRESET_GALLERY_IMAGES = [
  { name: "Luxury Pool", url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop" },
  { name: "Verdant Garden", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop" },
  { name: "Evening Lighting", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" },
  { name: "Backyard Lounge", url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop" },
];

interface GalleryImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

function GalleryImagePicker({ value, onChange }: GalleryImagePickerProps) {
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
              onChange(base64Data);
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
      if (file && file.type.startsWith("image/")) {
        handleFileUpload(file);
      } else {
        toast.error("Please drop an image file.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileUpload(file);
      } else {
        toast.error("Please select an image file.");
      }
    }
  };

  const isPreset = PRESET_GALLERY_IMAGES.some((p) => p.url === value);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <UploadCloud className="h-3.5 w-3.5" />
        Gallery Image <span className="text-destructive">*</span>
      </Label>

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
          value ? "aspect-video max-w-full w-full" : "p-4 text-center min-h-[110px]"
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
        ) : value ? (
          <>
            <img src={value} alt="Gallery Preview" className="h-full w-full object-cover" />
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
                  onClick={() => onChange("")}
                >
                  Remove
                </Button>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded text-[10px] font-medium border border-border shadow-sm">
              {isPreset ? "Preset Image" : "Uploaded File"}
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

      {/* Preset images selection strip */}
      <div className="space-y-1">
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          Or Select Preset
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESET_GALLERY_IMAGES.map((preset) => {
            const isSel = value === preset.url;
            return (
              <div
                key={preset.url}
                onClick={() => onChange(preset.url)}
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
    </div>
  );
}

// 4. GALLERY GRID EDITOR
export function GalleryGridEditor({ index }: EditorProps) {
  const { register, watch, setValue } = useFormContext<ServiceFormValues>();
  const gallery = watch(`sections.${index}.content.gallery`) || [];

  const handleAddImage = () => {
    setValue(`sections.${index}.content.gallery`, [
      ...gallery,
      { imageUrl: PRESET_GALLERY_IMAGES[0]?.url || "", caption: "Gallery Image Caption", altText: "Alt Text" }
    ], { shouldValidate: true });
  };

  const handleRemoveImage = (idx: number) => {
    const next = gallery.filter((_, i: number) => i !== idx);
    setValue(`sections.${index}.content.gallery`, next, { shouldValidate: true });
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between border-b pb-2">
        <Label className="text-xs font-semibold text-muted-foreground">Gallery Showcase Images ({gallery.length})</Label>
        <Button type="button" size="sm" onClick={handleAddImage} className="h-9 text-xs gap-1">
          <Plus className="h-4 w-4" /> Add Image
        </Button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {gallery.map((img: GalleryItem, idx: number) => {
          const currentUrl = watch(`sections.${index}.content.gallery.${idx}.imageUrl`) || img.imageUrl || "";

          return (
            <div key={idx} className="rounded-lg border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">IMAGE #{idx + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveImage(idx)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Picker */}
              <GalleryImagePicker
                value={currentUrl}
                onChange={(url) =>
                  setValue(`sections.${index}.content.gallery.${idx}.imageUrl`, url, { shouldValidate: true })
                }
              />

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Caption</Label>
                  <Input {...register(`sections.${index}.content.gallery.${idx}.caption`)} className="h-10 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Alt Text</Label>
                  <Input {...register(`sections.${index}.content.gallery.${idx}.altText`)} className="h-10 text-sm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
      { question: "FAQ Question?", answer: "FAQ Answer text goes here..." }
    ]);
  };

  const handleRemoveFaq = (idx: number) => {
    const next = accordions.filter((_, i: number) => i !== idx);
    setValue(`sections.${index}.content.accordionItems`, next);
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between border-b pb-2">
        <Label className="text-xs font-semibold text-muted-foreground">FAQ Accordion Items ({accordions.length})</Label>
        <Button type="button" size="sm" onClick={handleAddFaq} className="h-9 text-xs gap-1">
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {accordions.map((_: AccordionItem, idx: number) => (
          <div key={idx} className="rounded-lg border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">FAQ #{idx + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFaq(idx)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Question</Label>
              <Input {...register(`sections.${index}.content.accordionItems.${idx}.question`)} className="h-10 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Answer</Label>
              <Textarea rows={3} {...register(`sections.${index}.content.accordionItems.${idx}.answer`)} className="text-sm resize-none min-h-[80px]" />
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
          <Label className="text-xs font-semibold text-muted-foreground">CTA Banner Title</Label>
          <Input
            placeholder="e.g. Start Your Dream Project Today"
            {...register(`sections.${index}.content.cta.title` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Phone Number Link</Label>
          <Input
            placeholder="+971 50 123 4567"
            {...register(`sections.${index}.content.cta.phoneNumber` as const)}
            className="h-10 text-sm"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Description Text</Label>
        <Textarea
          rows={3}
          placeholder="Brief copy for banner..."
          {...register(`sections.${index}.content.cta.description` as const)}
          className="text-sm resize-none min-h-[80px]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Button Text</Label>
          <Input
            placeholder="Contact Us"
            {...register(`sections.${index}.content.cta.buttonText` as const)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Button Link</Label>
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
      { label: "Spec Label Name", value: "Spec Value Description" }
    ]);
  };

  const handleRemoveSpec = (idx: number) => {
    const next = specs.filter((_, i: number) => i !== idx);
    setValue(`sections.${index}.content.specs`, next);
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between border-b pb-2">
        <Label className="text-xs font-semibold text-muted-foreground">Technical Specifications ({specs.length})</Label>
        <Button type="button" size="sm" onClick={handleAddSpec} className="h-9 text-xs gap-1">
          <Plus className="h-4 w-4" /> Add Spec
        </Button>
      </div>

      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {specs.map((_: TechnicalSpec, idx: number) => (
          <div key={idx} className="flex gap-3 items-end">
            <div className="flex-1 grid gap-3 grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Spec Label</Label>
                <Input {...register(`sections.${index}.content.specs.${idx}.label`)} className="h-10 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Value</Label>
                <Input {...register(`sections.${index}.content.specs.${idx}.value`)} className="h-10 text-sm" />
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSpec(idx)} className="h-10 w-10 text-destructive hover:bg-destructive/10 shrink-0"><Trash2 className="h-4.5 w-4.5" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
