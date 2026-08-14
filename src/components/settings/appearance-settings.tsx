import React, { useCallback } from "react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/common/color-picker";
import { useThemeStore } from "@/lib/theme-store";
import { DEFAULT_PRIMARY_HEX } from "@/lib/theme";

export const AppearanceSettings = React.memo(function AppearanceSettings() {
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const setPrimaryColor = useThemeStore((s) => s.setPrimaryColor);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const handleResetColor = useCallback(() => {
    setPrimaryColor(DEFAULT_PRIMARY_HEX);
    toast.success("Primary color reset to default");
  }, [setPrimaryColor]);

  const handleModeChange = useCallback(
    (checked: boolean) => {
      setMode(checked ? "dark" : "light");
    },
    [setMode],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Primary color</CardTitle>
            <CardDescription>
              Changes the accent color used across every button, active state,
              chart, and badge in the dashboard.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetColor}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
        </CardHeader>
        <CardContent>
          <ColorPicker value={primaryColor} onChange={setPrimaryColor} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display mode</CardTitle>
          <CardDescription>
            Switch between light and dark mode for the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">
                Applies to this dashboard only, not your public website.
              </p>
            </div>
            <Switch
              checked={mode === "dark"}
              onCheckedChange={handleModeChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
