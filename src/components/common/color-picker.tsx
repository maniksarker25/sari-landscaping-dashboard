import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { presetColors } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

const HEX_PATTERN = /^#([0-9A-Fa-f]{6})$/;

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-medium">Preset colors</Label>
        <div className="mt-3 flex flex-wrap gap-3">
          {presetColors.map((preset) => {
            const isActive = preset.hex.toLowerCase() === value.toLowerCase();
            return (
              <button
                key={preset.hex}
                type="button"
                title={preset.label}
                onClick={() => onChange(preset.hex)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-105",
                  isActive && "ring-2 ring-foreground"
                )}
                style={{ backgroundColor: preset.hex }}
                aria-label={`Use ${preset.label}`}
              >
                {isActive && <Check className="h-4 w-4 text-white drop-shadow" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="custom-color" className="text-sm font-medium">
          Custom color
        </Label>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
            <input
              type="color"
              value={HEX_PATTERN.test(value) ? value : "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-none p-0 absolute left-1/2 top-1/2"
              aria-label="Pick a custom color"
            />
          </div>
          <Input
            id="custom-color"
            value={value}
            onChange={(e) => {
              const next = e.target.value;
              onChange(next);
            }}
            placeholder="#0E3B36"
            className="max-w-[140px] font-mono uppercase"
            maxLength={7}
          />
        </div>
        {!HEX_PATTERN.test(value) && (
          <p className="mt-2 text-xs text-destructive">Enter a valid 6-digit hex color, e.g. #0E3B36.</p>
        )}
      </div>
    </div>
  );
}
