import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, ChevronDown, ChevronUp } from "lucide-react";
import type { ServiceFormValues } from "@/lib/validations";

export function SeoPanel() {
  const [seoSettingsOpen, setSeoSettingsOpen] = React.useState(false);
  const { register, setValue, watch } = useFormContext<ServiceFormValues>();

  const seo = watch("seo");

  return (
    <Card className="border border-border bg-card">
      <div
        onClick={() => setSeoSettingsOpen(!seoSettingsOpen)}
        className="flex items-center justify-between p-5 border-b border-border cursor-pointer hover:bg-muted/10 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Globe className="h-4.5 w-4.5 text-primary" />
          <span className="text-sm font-semibold tracking-tight text-foreground">SEO Metadata Controls</span>
        </div>
        {seoSettingsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </div>

      {seoSettingsOpen && (
        <CardContent className="space-y-4 pt-5 pb-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="seo.metaTitle" className="text-xs font-semibold text-muted-foreground">
                Meta Browser Title
              </Label>
              <Input
                id="seo.metaTitle"
                placeholder="SEO Browser Title..."
                {...register("seo.metaTitle")}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seo.canonicalUrl" className="text-xs font-semibold text-muted-foreground">
                Canonical URL
              </Label>
              <Input
                id="seo.canonicalUrl"
                placeholder="https://sari.ae/services/..."
                {...register("seo.canonicalUrl")}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo.metaDescription" className="text-xs font-semibold text-muted-foreground">
              Meta Description
            </Label>
            <Textarea
              id="seo.metaDescription"
              rows={3}
              placeholder="Enter teaser paragraph for search listings (google snippet)..."
              {...register("seo.metaDescription")}
              className="text-sm resize-none min-h-[80px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seo.keywords" className="text-xs font-semibold text-muted-foreground">
              Keywords (Comma Separated)
            </Label>
            <Input
              id="seo.keywords"
              placeholder="pools, custom, landscaping, landscaping design"
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                setValue("seo.keywords", tags);
              }}
              defaultValue={seo?.keywords?.join(", ") || ""}
              className="h-10 text-sm"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
