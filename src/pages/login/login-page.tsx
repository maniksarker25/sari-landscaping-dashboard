import * as React from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Waves, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useLoginMutation,
  useLazyGetMyProfileQuery,
} from "@/redux/services/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCredentials, setToken, logout } from "@/redux/services/authSlice";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const reduxAuth = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(reduxAuth.accessToken && reduxAuth.user);

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();
  const [triggerGetProfile, { isLoading: isFetchingProfile }] =
    useLazyGetMyProfileQuery();

  const isLoading = isLoggingIn || isFetchingProfile;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "superadmin@dfl.com", password: "SuperAdmin@123" },
  });

  if (isAuthenticated) {
    const redirectTo =
      (location.state as { from?: Location })?.from?.pathname ?? "/";
    return <Navigate to={redirectTo} replace />;
  }

  async function onSubmit(values: LoginValues) {
    setServerError(null);

    try {
      // Step 1: Login call to /auth/login
      const loginResponse = await loginApi(values).unwrap();

      const accessToken =
        loginResponse.data?.accessToken ||
        loginResponse.accessToken ||
        loginResponse.data?.token ||
        loginResponse.token ||
        "";

      if (!accessToken) {
        setServerError(
          "Authentication failed: No access token returned from server.",
        );
        return;
      }

      // Temporarily set token in Redux state so prepareHeaders attaches Authorization header for get-my-profile
      dispatch(setToken({ accessToken }));

      // Step 2: Fetch user profile from /User/get-my-profile
      try {
        const profileResponse = await triggerGetProfile().unwrap();
        const userProfile = profileResponse.data || profileResponse;

        if (!userProfile) {
          throw new Error("Unable to retrieve user profile details.");
        }

        // Save authenticated user & token in Redux
        dispatch(setCredentials({ user: userProfile, accessToken }));

        toast.success("Successfully signed in!");
        const redirectTo =
          (location.state as { from?: Location })?.from?.pathname ?? "/";
        navigate(redirectTo, { replace: true });
      } catch (profileErr: any) {
        console.error("Failed to fetch user profile:", profileErr);
        dispatch(logout());
        const errorMsg =
          profileErr?.data?.message ||
          profileErr?.message ||
          "Could not retrieve profile. Please log in again.";
        setServerError(errorMsg);
      }
    } catch (loginErr: any) {
      console.error("Login request failed:", loginErr);
      const errorMessage =
        loginErr?.data?.message ||
        loginErr?.message ||
        loginErr?.error ||
        "Invalid email or password. Please try again.";
      setServerError(errorMessage);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Waves className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">
            Sari Landscaping Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your dashboard content
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive"
              >
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? isLoggingIn
                  ? "Signing in..."
                  : "Verifying profile..."
                : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
