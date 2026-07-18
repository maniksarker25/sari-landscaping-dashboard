/**
 * Theme engine for the admin dashboard.
 *
 * The dashboard exposes exactly ONE user-adjustable color: `primary`
 * (see Settings > Appearance). Everything else — backgrounds, borders,
 * muted text, destructive actions — stays on a fixed neutral scale defined
 * in `index.css`, so changing the primary color re-skins every button,
 * active nav item, badge, and chart accent without breaking contrast
 * elsewhere in the UI.
 *
 * Colors are stored as hex (what a color picker naturally produces) and
 * converted to an HSL triple string at apply-time, because the Tailwind
 * config consumes `hsl(var(--primary) / <alpha-value>)`.
 */

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): HSL {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToString({ h, s, l }: HSL): string {
  return `${h} ${s}% ${l}%`;
}

/** Perceived brightness heuristic (YIQ) to choose black or white foreground text. */
export function contrastForeground(hex: string): "0 0% 100%" | "222 20% 12%" {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "222 20% 12%" : "0 0% 100%";
}

export const presetColors: { label: string; hex: string }[] = [
  { label: "Lagoon Teal", hex: "#0E3B36" },
  { label: "Indigo", hex: "#4F46E5" },
  { label: "Slate", hex: "#334155" },
  { label: "Emerald", hex: "#047857" },
  { label: "Amber", hex: "#B45309" },
  { label: "Rose", hex: "#BE123C" },
  { label: "Violet", hex: "#7C3AED" },
];

export const DEFAULT_PRIMARY_HEX = "#0E3B36";

export function applyPrimaryColor(hex: string) {
  const root = document.documentElement;
  root.style.setProperty("--primary", hslToString(hexToHsl(hex)));
  root.style.setProperty("--primary-foreground", contrastForeground(hex));
  root.style.setProperty("--ring", hslToString(hexToHsl(hex)));
}
