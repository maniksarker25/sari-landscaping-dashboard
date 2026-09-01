import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Waves,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resetToken = searchParams.get("token") || "demo-reset-token";
  const userEmail = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const watchPassword = watch("password", "");

  // Real-time password requirement metrics
  const hasMinLength = watchPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(watchPassword);
  const hasNumber = /[0-9]/.test(watchPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(watchPassword);

  async function onSubmit(values: ResetPasswordFormValues) {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const payload = {
      action: "SET_NEW_PASSWORD",
      token: resetToken,
      email: userEmail,
      newPassword: values.password,
      timestamp: new Date().toISOString(),
    };

    // =========================================================================
    // API INTEGRATION PLACEHOLDER:
    // Replace the console.log below with your actual backend request:
    // const res = await fetch('/api/auth/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // =========================================================================
    // console.log(
    //   "%c[API Integration Ready] Set New Password Submitted:",
    //   "color: #10b981; font-weight: bold; font-size: 13px;",
    //   payload,
    // );

    toast.success("Password reset successfully!");
    setIsSuccess(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Header Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Waves className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">DFL</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSuccess ? "Password updated" : "Set your new password"}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {!isSuccess ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {userEmail && (
                <div className="rounded-md bg-muted/50 p-2.5 text-xs text-muted-foreground">
                  Resetting password for:{" "}
                  <strong className="font-medium text-foreground">
                    {userEmail}
                  </strong>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    {...register("password")}
                  />
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    {...register("confirmPassword")}
                  />
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements Checklist */}
              <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1.5 text-xs">
                <p className="font-medium text-foreground mb-1">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-1 gap-1 text-muted-foreground">
                  <span
                    className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                  >
                    {hasMinLength ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5 opacity-40" />
                    )}
                    At least 8 characters
                  </span>
                  <span
                    className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                  >
                    {hasUppercase ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5 opacity-40" />
                    )}
                    At least one uppercase letter (A-Z)
                  </span>
                  <span
                    className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                  >
                    {hasNumber ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5 opacity-40" />
                    )}
                    At least one number (0-9)
                  </span>
                  <span
                    className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                  >
                    {hasSpecial ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5 opacity-40" />
                    )}
                    Special character (Optional)
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Set New Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-semibold">Password Changed!</h2>
                <p className="text-xs text-muted-foreground">
                  Your password has been successfully updated. You can now log
                  in using your new credentials.
                </p>
              </div>

              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Sign In Now
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Link back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
