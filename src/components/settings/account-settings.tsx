import React, { useMemo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/validations";
import { useAppSelector } from "@/redux/hooks";

export const AccountSettings = React.memo(function AccountSettings() {
  const user = useAppSelector((state) => state.auth.user);

  const avatarInitials = useMemo(() => {
    if (user?.avatarInitials) return user.avatarInitials;
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "AD";
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Account Details
          </CardTitle>
          <CardDescription>
            Your administrator account information and role permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">
                {user?.name || user?.email || "Admin User"}
              </p>
              {user?.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={user?.role || "Administrator"}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Account Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <ChangePasswordForm />
    </div>
  );
});

export const ChangePasswordForm = React.memo(function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const defaultValues = useMemo<ChangePasswordFormValues>(
    () => ({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    async (_values: ChangePasswordFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success("Password updated successfully!");
      reset();
    },
    [reset],
  );

  const toggleShowCurrent = useCallback(() => {
    setShowCurrent((prev) => !prev);
  }, []);

  const toggleShowNew = useCallback(() => {
    setShowNew((prev) => !prev);
  }, []);

  const toggleShowConfirm = useCallback(() => {
    setShowConfirm((prev) => !prev);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your administrator password to maintain account security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 max-w-lg"
        >
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
                aria-invalid={!!errors?.currentPassword}
                {...register("currentPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowCurrent}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors?.currentPassword && (
              <p className="text-xs text-destructive font-medium">
                {errors?.currentPassword?.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password (min. 6 characters)"
                aria-invalid={!!errors?.newPassword}
                {...register("newPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowNew}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors?.newPassword && (
              <p className="text-xs text-destructive font-medium">
                {errors?.newPassword?.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                aria-invalid={!!errors?.confirmPassword}
                {...register("confirmPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowConfirm}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors?.confirmPassword && (
              <p className="text-xs text-destructive font-medium">
                {errors?.confirmPassword?.message}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});
