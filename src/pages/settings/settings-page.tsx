import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColorPicker } from "@/components/common/color-picker";
import { settingsFormSchema, type SettingsFormValues } from "@/lib/validations";
import { useSettingsStore } from "@/lib/settings-store";
import { useThemeStore } from "@/lib/theme-store";
import { useAuthStore } from "@/lib/auth-store";
import { DEFAULT_PRIMARY_HEX } from "@/lib/theme";

export default function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your site details, appearance, and account." />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsForm settings={settings} onSave={updateSettings} />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GeneralSettingsForm({
  settings,
  onSave,
}: {
  settings: SettingsFormValues;
  onSave: (patch: Partial<SettingsFormValues>) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings,
  });

  async function onSubmit(values: SettingsFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    onSave(values);
    toast.success("Site settings saved");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site information</CardTitle>
        <CardDescription>This information is used across your website's header, footer, and metadata.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site name</Label>
              <Input id="siteName" {...register("siteName")} />
              {errors.siteName && <p className="text-xs text-destructive">{errors.siteName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" {...register("tagline")} />
              {errors.tagline && <p className="text-xs text-destructive">{errors.tagline.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AppearanceSettings() {
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const setPrimaryColor = useThemeStore((s) => s.setPrimaryColor);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Primary color</CardTitle>
            <CardDescription>
              Changes the accent color used across every button, active state, chart, and badge in the dashboard.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPrimaryColor(DEFAULT_PRIMARY_HEX);
              toast.success("Primary color reset to default");
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </CardHeader>
        <CardContent>
          <ColorPicker value={primaryColor} onChange={setPrimaryColor} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display mode</CardTitle>
          <CardDescription>Switch between light and dark mode for the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">Applies to this dashboard only, not your public website.</p>
            </div>
            <Switch checked={mode === "dark"} onCheckedChange={(checked) => setMode(checked ? "dark" : "light")} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountSettings() {
  const user = useAuthStore((s) => s.user);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Your admin account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{user?.avatarInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={user?.role === "owner" ? "Owner" : "Editor"} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email} disabled />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          This is a demo account. Password changes and team invites aren't wired up in this build.
        </p>
      </CardContent>
    </Card>
  );
}
