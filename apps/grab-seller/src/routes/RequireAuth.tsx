import { Navigate, Outlet, useLocation } from "react-router";
import { routes } from "@khinemyaezin/seller-contracts";
import { useAuth } from "../app/AuthContext";

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm grid gap-6">
          <div role="status" className="p-8 text-sm text-muted-foreground">Checking session…</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${routes.login}`}
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return <Outlet />;
}
