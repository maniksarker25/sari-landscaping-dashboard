import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  ImageOff,
  Globe,
  Layers,
  Search,
  Calendar,
  ExternalLink,
  Waves,
  Trees,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import type { Service, BlockType } from "@/types";

interface ServiceViewDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (service: Service) => void;
}

function getBlockLabel(type: BlockType): string {
  switch (type) {
    case "hero_section":
      return "Hero Section";
    case "rich_text_jodit":
      return "Rich Text Content";
    case "features_grid":
      return "Features Grid";
    case "gallery_grid":
      return "Gallery Grid";
    case "faq_accordion":
      return "FAQ Accordion";
    case "cta_banner":
      return "CTA Banner";
    case "technical_specs":
      return "Technical Specs";
    case "contact_form":
      return "Contact Form";
    default:
      return type;
  }
}

export function ServiceViewDialog({
  service,
  open,
  onOpenChange,
  onDelete,
}: ServiceViewDialogProps) {
  const navigate = useNavigate();

  if (!service) return null;

  const categoryColor =
    service.category === "Pools"
      ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800"
      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${categoryColor}`}
              >
                {service.category === "Pools" ? (
                  <Waves className="h-3.5 w-3.5" />
                ) : (
                  <Trees className="h-3.5 w-3.5" />
                )}
                {service.category}
              </span>
              <StatusBadge
                status={service.isPublished ? "published" : "draft"}
              />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold mt-2">
            {service.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span>/{service.slug}</span>
            <span>•</span>
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              Updated{" "}
              {service.updatedAt ? formatDate(service.updatedAt) : "N/A"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Featured Image */}
          <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border bg-muted">
            {service.featuredImage ? (
              <img
                src={service.featuredImage}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="h-8 w-8" />
                <span className="text-xs">No featured image uploaded</span>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <span className="text-xs text-muted-foreground block">
                Category
              </span>
              <span className="text-sm font-semibold">{service.category}</span>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <span className="text-xs text-muted-foreground block">
                Content Blocks
              </span>
              <span className="text-sm font-semibold">
                {service.sections?.length || 0} Blocks
              </span>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <span className="text-xs text-muted-foreground block">
                Status
              </span>
              <span className="text-sm font-semibold capitalize">
                {service.isPublished ? "Live / Published" : "Draft"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Page Sections Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Page Layout Blocks ({service.sections?.length || 0})
              </h4>
            </div>
            {!service.sections || service.sections.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No blocks configured yet.
              </p>
            ) : (
              <div className="space-y-2">
                {service.sections.map((block, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-md border border-border p-3 text-xs bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {getBlockLabel(block.blockType)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Layout: {block.layoutStyle || "default"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {block.blockType}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Settings */}
          {service.seo && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Search className="h-4 w-4 text-primary" />
                  SEO Configuration
                </h4>
                <div className="rounded-md border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
                  <div>
                    <span className="font-medium text-muted-foreground block">
                      Meta Title:
                    </span>
                    <span className="text-foreground">
                      {service.seo.metaTitle || service.title}
                    </span>
                  </div>
                  {service.seo.metaDescription && (
                    <div>
                      <span className="font-medium text-muted-foreground block">
                        Meta Description:
                      </span>
                      <span className="text-foreground">
                        {service.seo.metaDescription}
                      </span>
                    </div>
                  )}
                  {service.seo.keywords && service.seo.keywords.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground block mb-1">
                        Keywords:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {service.seo.keywords.map((kw, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex w-full items-center justify-between gap-2">
            <div>
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onDelete(service);
                  }}
                  className="gap-1.5"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/services/edit/${service.id}`);
                }}
                className="gap-1.5"
              >
                <Pencil className="h-4 w-4" /> Edit Service
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
