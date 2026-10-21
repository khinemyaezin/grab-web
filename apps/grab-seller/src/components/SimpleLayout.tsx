import { Outlet } from "react-router";
import { ThemeToggle, Toaster } from "@khinemyaezin/seller-ui";
import { useAuth } from "../app/AuthContext";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { LogOutIcon } from "lucide-react";

export function SimpleLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex h-14 items-center justify-end px-8 gap-3">
          <ThemeToggle />
          {isAuthenticated && (<Button variant="destructive" onClick={logout}>
            <LogOutIcon className="size-4" />
          </Button>)}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
