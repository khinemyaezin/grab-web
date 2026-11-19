import { useEffect, useState } from "react";
import { useAuth } from "../../app/AuthContext";

export function LoginRedirectPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    login().catch((err) => {
      if (!active) return;
      console.error("Failed to initiate login redirect", err);
      setError("Failed to initiate login redirect.");
    });

    return () => {
      active = false;
    };
  }, [login]);

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6">
        <div role="alert" className="text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm grid gap-6">
        <div role="status" className="p-8 text-center text-sm text-muted-foreground">
          Redirecting to login…
        </div>
      </div>
    </div>
  );
}

/** Backwards-compatible alias for existing route references */
export const AuthRemote = LoginRedirectPage;
