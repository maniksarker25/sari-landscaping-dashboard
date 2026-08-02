import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Laptop,
  Smartphone,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Waves,
  TreePalm,
  Hammer,
  Shield,
  Droplets,
  Flame,
  Sprout,
  Lightbulb,
  ImageIcon,
  Mail,
  Info,
} from "lucide-react";
import type {
  PageBlock,
  FeatureItem,
  GalleryItem,
  AccordionItem,
} from "@/types";
import { fileRegistry } from "@/lib/file-registry";

// Preset icon definitions
const PRESET_ICONS: Record<string, React.ComponentType<any>> = {
  Waves,
  TreePalm,
  Sprout,
  Droplets,
  Lightbulb,
  Hammer,
  Shield,
  Flame,
};

interface GalleryItemPreviewProps {
  item: GalleryItem;
}

function GalleryItemPreview({ item }: GalleryItemPreviewProps) {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);

  const fileInRegistry = item.uploadKey ? fileRegistry.get(item.uploadKey) : null;
  const attachedFile = item.file || fileInRegistry;

  React.useEffect(() => {
    if (attachedFile && attachedFile instanceof File) {
      const url = URL.createObjectURL(attachedFile);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setBlobUrl(null);
    }
  }, [attachedFile]);

  const displaySrc = blobUrl || item.imageUrl || "";

  return (
    <div className="group relative aspect-video overflow-hidden rounded border border-border bg-muted flex items-center justify-center">
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={item.altText || "Gallery Image"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-muted-foreground/60">
          <ImageIcon className="h-5 w-5 mb-0.5" />
          <span className="text-[8px] font-medium">No Image</span>
        </div>
      )}
      {item.caption && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-2 transition-opacity duration-200">
          <span className="text-[9px] text-white text-center font-medium line-clamp-2">
            {item.caption}
          </span>
        </div>
      )}
    </div>
  );
}

interface PagePreviewProps {
  sections: PageBlock[];
}

export const PagePreview = React.memo(function PagePreview({
  sections,
}: PagePreviewProps) {
  const [previewViewport, setPreviewViewport] = React.useState<
    "desktop" | "mobile"
  >("desktop");
  const [openFaqMap, setOpenFaqMap] = React.useState<Record<string, boolean>>(
    {},
  );

  const toggleFaq = (faqKey: string) => {
    setOpenFaqMap((prev) => ({
      ...prev,
      [faqKey]: !prev[faqKey],
    }));
  };

  const renderPreviewIcon = (name?: string) => {
    const IconComponent =
      name && PRESET_ICONS[name] ? PRESET_ICONS[name] : Waves;
    if (!IconComponent) return null;
    return <IconComponent className="h-4.5 w-4.5 text-primary" />;
  };

  const renderPreviewBlock = (block: PageBlock) => {
    const { blockType, layoutStyle, content } = block;

    const bgStyleClass =
      layoutStyle === "accent_bg"
        ? "bg-primary/5 border-y border-primary/10"
        : "";
    const centeringClass =
      layoutStyle === "container_centered"
        ? "max-w-xl mx-auto text-center"
        : "";

    switch (blockType) {
      case "hero_section": {
        const hero = content.hero;
        return (
          <div
            className="relative aspect-video w-full bg-cover bg-center flex items-end p-4 border-b border-border"
            style={{
              backgroundImage: hero?.bgImage ? `url(${hero.bgImage})` : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-0" />
            <div className="relative z-10 text-white space-y-1 max-w-sm">
              <Badge className="bg-primary hover:bg-primary text-white border-0 text-[8px] font-bold tracking-wider uppercase mb-1">
                Aurelia Luxury Services
              </Badge>
              <h2 className="text-sm font-extrabold leading-tight md:text-base text-white">
                {hero?.headline || "Headline text..."}
              </h2>
              {hero?.subheadline && (
                <p className="text-[10px] text-white/85 leading-snug line-clamp-2">
                  {hero.subheadline}
                </p>
              )}
              {hero?.ctaText && (
                <Button
                  size="sm"
                  className="h-7 text-[9px] font-semibold mt-2.5 text-primary-foreground bg-primary border-0"
                  type="button"
                >
                  {hero.ctaText}
                </Button>
              )}
            </div>
          </div>
        );
      }

      case "rich_text_jodit": {
        return (
          <div className={`p-4 ${bgStyleClass}`}>
            <div
              className={`${centeringClass} preview-description-content text-[11px] leading-relaxed text-muted-foreground [&_h2]:text-xs [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-3 [&_h2]:mb-1 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4`}
            >
              {content.richTextHtml && content.richTextHtml !== "<p></p>" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: content.richTextHtml }}
                />
              ) : (
                <p className="italic text-muted-foreground/50">
                  Rich text block holds content description.
                </p>
              )}
            </div>
          </div>
        );
      }

      case "features_grid": {
        const feats = content.features || [];
        const gridCols =
          layoutStyle === "grid_2_col"
            ? "grid-cols-2"
            : layoutStyle === "grid_4_col"
              ? "grid-cols-4"
              : "grid-cols-3"; // default 3 col

        return (
          <div className={`p-4 ${bgStyleClass}`}>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest text-center">
                Our Deliverables
              </h4>
              {feats.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic text-center">
                  No features configured.
                </p>
              ) : (
                <div className={`grid gap-2.5 ${gridCols}`}>
                  {feats.map((item: FeatureItem, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-md border border-border p-2.5 bg-card flex flex-col gap-1.5 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        {renderPreviewIcon(item.iconUrl)}
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-bold text-foreground leading-tight">
                          {item.title}
                        </h5>
                        {item.description && (
                          <p className="text-[9px] text-muted-foreground leading-snug">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case "gallery_grid": {
        const items = content.gallery || [];
        const gridCols =
          layoutStyle === "grid_2_col"
            ? "grid-cols-2"
            : layoutStyle === "grid_4_col"
              ? "grid-cols-4"
              : "grid-cols-3"; // default 3 col

        return (
          <div className={`p-4 ${bgStyleClass}`}>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest text-center">
                Visual Gallery Showcase
              </h4>
              {items.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic text-center">
                  No images uploaded.
                </p>
              ) : (
                <div className={`grid gap-2 ${gridCols}`}>
                  {items.map((item: GalleryItem, idx: number) => (
                    <GalleryItemPreview key={idx} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case "faq_accordion": {
        const items = content.accordionItems || [];
        return (
          <div className={`p-4 ${bgStyleClass}`}>
            <div className="max-w-md mx-auto space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest text-center">
                Frequently Asked Questions
              </h4>
              {items.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic text-center">
                  No FAQ items defined.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {items.map((item: AccordionItem, idx: number) => {
                    const faqKey = `faq_${idx}`;
                    const isOpen = !!openFaqMap[faqKey];
                    return (
                      <div
                        key={idx}
                        className="rounded border bg-card overflow-hidden"
                      >
                        <div
                          onClick={() => toggleFaq(faqKey)}
                          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/10 select-none"
                        >
                          <span className="text-[10px] font-bold text-foreground pr-4 leading-tight">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                        {isOpen && (
                          <div className="px-3 pb-2.5 pt-0.5 border-t border-muted border-dashed bg-muted/10">
                            <p className="text-[9.5px] text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      }

      case "cta_banner": {
        const cta = content.cta;
        return (
          <div className="p-5 border-y border-primary/20 bg-primary text-primary-foreground text-center space-y-2">
            <h4 className="text-xs font-bold leading-tight uppercase tracking-wider">
              {cta?.title || "CTA Banner Title"}
            </h4>
            {cta?.description && (
              <p className="text-[9.5px] text-primary-foreground/90 max-w-xs mx-auto leading-relaxed">
                {cta.description}
              </p>
            )}
            <div className="flex gap-2 items-center justify-center pt-1.5">
              {cta?.buttonText && (
                <Button
                  size="sm"
                  className="h-6.5 text-[8.5px] font-semibold bg-background text-primary border-0 hover:bg-muted"
                  type="button"
                >
                  {cta.buttonText}
                </Button>
              )}
              {cta?.phoneNumber && (
                <a
                  href={`tel:${cta.phoneNumber}`}
                  className="text-[9.5px] font-bold underline px-2 py-1"
                >
                  Call {cta.phoneNumber}
                </a>
              )}
            </div>
          </div>
        );
      }

      case "technical_specs": {
        const specs = content.specs || [];
        return (
          <div className={`p-4 ${bgStyleClass}`}>
            <div className="max-w-xs mx-auto space-y-2">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest text-center">
                Technical Specifications
              </h4>
              {specs.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic text-center">
                  No specs added.
                </p>
              ) : (
                <div className="rounded border overflow-hidden bg-card">
                  <table className="w-full text-[10px]">
                    <tbody>
                      {specs.map((spec, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-muted last:border-0 hover:bg-muted/10"
                        >
                          <td className="px-3 py-1.5 font-semibold text-foreground/80 border-r">
                            {spec.label}
                          </td>
                          <td className="px-3 py-1.5 text-muted-foreground">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      }

      case "contact_form": {
        return (
          <div className={`p-4 ${bgStyleClass}`}>
            <div className="max-w-xs mx-auto border rounded-xl p-3.5 bg-card space-y-2.5 shadow-sm">
              <div className="text-center space-y-0.5">
                <h5 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  Get a Free Consultation
                </h5>
                <p className="text-[9px] text-muted-foreground">
                  Submit details to receive quote estimation.
                </p>
              </div>
              <div className="space-y-1.5">
                <input
                  placeholder="Full Name"
                  disabled
                  className="flex h-8 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-[10px] shadow-sm transition-colors"
                />
                <input
                  placeholder="Email Address"
                  disabled
                  className="flex h-8 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-[10px] shadow-sm transition-colors"
                />
                <input
                  placeholder="Phone Number"
                  disabled
                  className="flex h-8 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-[10px] shadow-sm transition-colors"
                />
                <textarea
                  placeholder="Describe project parameters..."
                  disabled
                  rows={2}
                  className="flex min-h-[50px] w-full rounded-md border border-input bg-muted/30 px-3 py-1.5 text-[10px] shadow-sm transition-colors resize-none"
                />
                <Button
                  size="sm"
                  disabled
                  className="w-full h-8 text-[10px] font-bold"
                  type="button"
                >
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/40 px-4 py-2 shrink-0">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
          Live Compiled Page
        </span>

        <div className="flex items-center gap-1 bg-muted rounded-md p-0.5 border border-border">
          <Button
            variant={previewViewport === "desktop" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setPreviewViewport("desktop")}
            className="h-6 w-6 rounded-sm text-muted-foreground hover:text-foreground"
            title="Desktop Preview"
            type="button"
          >
            <Laptop className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={previewViewport === "mobile" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setPreviewViewport("mobile")}
            className="h-6 w-6 rounded-sm text-muted-foreground hover:text-foreground"
            title="Mobile Preview"
            type="button"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Viewport Frame */}
      <div className="flex-1 overflow-y-auto rounded-b-lg border border-border bg-muted/10 p-4 scrollbar-thin flex items-center justify-center">
        <div
          className={`w-full bg-background transition-all duration-300 shadow-xl overflow-x-hidden ${
            previewViewport === "mobile"
              ? "max-w-[340px] h-[580px] border-[8px] border-slate-800 dark:border-slate-700 rounded-[28px] relative overflow-y-auto scrollbar-thin"
              : "h-full min-h-[500px]"
          }`}
        >
          {/* Smartphone camera bezel notch */}
          {previewViewport === "mobile" && (
            <div className="sticky top-0 left-0 right-0 h-4 bg-slate-800 dark:bg-slate-700 z-30 flex justify-center items-center">
              <div className="h-2 w-16 rounded-full bg-black/45" />
            </div>
          )}

          {/* Iterative public website builder page compiler */}
          <div className="relative w-full">
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center gap-3">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">
                  Compile output will display here.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {sections.map((block, idx) => (
                  <div key={idx} className="relative w-full">
                    {renderPreviewBlock(block)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
