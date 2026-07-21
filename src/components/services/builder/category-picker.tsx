import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, TreePalm } from "lucide-react";

interface CategoryPickerProps {
  onSelect: (category: "Pools" | "Landscaping") => void;
  onCancel: () => void;
}

export function CategoryPicker({ onSelect, onCancel }: CategoryPickerProps) {
  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="space-y-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs py-1 px-2.5 font-medium border-0">
            New Service Definition
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Choose Service Category
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Select the business category for this new landing page. This customizes configuration defaults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card
            onClick={() => onSelect("Pools")}
            className="group border border-border bg-card hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg text-left"
          >
            <CardContent className="p-8 flex flex-col items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <Waves className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Custom Pools & Spas
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Infinity-edge construction, plunge pools, spas, water features, structural engineering, and aquatic installations.
                </p>
              </div>
              <Button className="mt-4 text-xs font-semibold group-hover:bg-primary" type="button">
                Build Pool Service
              </Button>
            </CardContent>
          </Card>

          <Card
            onClick={() => onSelect("Landscaping")}
            className="group border border-border bg-card hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg text-left"
          >
            <CardContent className="p-8 flex flex-col items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <TreePalm className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Landscape & Hardscaping
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Xeriscaping plans, soil adaptation, micro-drip irrigation, lighting layouts, stone paving, structures, and pergolas.
                </p>
              </div>
              <Button className="mt-4 text-xs font-semibold group-hover:bg-primary" type="button">
                Build Landscape Service
              </Button>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground mt-4"
          type="button"
        >
          Cancel and Return
        </Button>
      </div>
    </div>
  );
}
