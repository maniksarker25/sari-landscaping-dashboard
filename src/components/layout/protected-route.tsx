import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetMyProfileQuery } from "@/redux/services/authApi";
import { logout, setUser } from "@/redux/services/authSlice";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const token = useAppSelector((state) => state.auth.accessToken);

  // If no token exists at all, navigate immediately to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Fetch profile to validate active session
  const { data: profileResponse, isLoading, isError } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });

  React.useEffect(() => {
    if (profileResponse) {
      const userProfile = profileResponse.data || profileResponse;
      dispatch(setUser(userProfile));
    }
  }, [profileResponse, dispatch]);

  React.useEffect(() => {
    if (isError) {
      dispatch(logout());
    }
  }, [isError, dispatch]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
