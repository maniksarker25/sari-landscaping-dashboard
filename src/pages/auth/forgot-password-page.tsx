import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Waves,
  ArrowLeft,
  Mail,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Handle countdown for resend button
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function onSubmit(values: ForgotPasswordFormValues) {
    // Simulate network delay for API readiness
    await new Promise((resolve) => setTimeout(resolve, 800));

    // =========================================================================
    // API INTEGRATION PLACEHOLDER:
    // Replace the console.log below with your backend endpoint call, e.g.:
    // const res = await fetch('/api/auth/forgot-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(values),
    // });
    // =========================================================================
    // console.log(
    //   "%c[API Integration Ready] Forgot Password Request:",
    //   "color: #10b981; font-weight: bold; font-size: 13px;",
    //   {
    //     action: "FORGOT_PASSWORD_REQUEST",
    //     email: values.email,
    //     timestamp: new Date().toISOString(),
    //   },
    // );

    toast.success("Password reset instructions sent!");
    setSubmittedEmail(values.email);
    setIsSubmitted(true);
    setResendCooldown(30);
  }

  function handleResend() {
    if (resendCooldown > 0) return;

    // console.log(
    //   "%c[API Integration Ready] Resend Password Reset Email:",
    //   "color: #3b82f6; font-weight: bold; font-size: 13px;",
    //   {
    //     action: "RESEND_RESET_EMAIL",
    //     email: submittedEmail,
    //     timestamp: new Date().toISOString(),
    //   },
    // );

    toast.info("A new reset email has been dispatched.");
    setResendCooldown(30);
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
            {isSubmitted
              ? "Check your email inbox"
              : "Reset your account password"}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@aureliaoutdoor.com"
                    className="pl-9"
                    {...register("email")}
                  />
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Enter the email address associated with your account and
                we&apos;ll send you a password reset link.
              </p>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-semibold">Instructions Sent</h2>
                <p className="text-xs text-muted-foreground">
                  We sent a password reset link to:
                  <br />
                  <strong className="font-medium text-foreground">
                    {submittedEmail}
                  </strong>
                </p>
              </div>

              <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or resend.
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Resend email in ${resendCooldown}s`
                    : "Resend password reset email"}
                </Button>

                {/* Direct action link to facilitate testing the Set New Password flow */}
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full text-xs text-primary"
                  onClick={() =>
                    navigate(
                      `/reset-password?email=${encodeURIComponent(submittedEmail)}&token=demo-reset-token-123`,
                    )
                  }
                >
                  <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                  Proceed to Set New Password (Demo)
                </Button>
              </div>
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
