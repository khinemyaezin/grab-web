import { useEffect } from "react";
import { Outlet } from "react-router";
import { SidebarProvider } from "@khinemyaezin/seller-ui/components/sidebar";
import { TooltipProvider } from "@khinemyaezin/seller-ui/components/tooltip";
import { Toaster, ContextBar, PlatformProvider } from "@khinemyaezin/seller-ui";
import { AdminSidebar } from "./AdminSidebar";
import { AdminSiteHeader } from "./AdminSiteHeader";
import { toast } from "@khinemyaezin/seller-ui/components/index";
import { useAuth } from "../app/AuthContext";

export function DashboardLayout() {
  const { platform } = useAuth();

  useEffect(() => {
    const unsubscribe = platform.events.subscribe("shell:toast:v1", (payload) => {
      const { type, message, description, position } = payload;
      toast[type](message, { description, position });
    });
    return unsubscribe;
  }, [platform.events]);

  return (
    <PlatformProvider platform={platform}>
      <TooltipProvider>
        <SidebarProvider className="flex flex-col" style={{
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12 + 1px)"
        } as Record<string, string>}>
          <div className="flex flex-1">
            <AdminSidebar />
            <main className="min-h-screen flex-1 bg-background dark:bg-black">
              <AdminSiteHeader />
              <ContextBar saveTimeoutMs={130_000} />
              <Toaster />
              <Outlet />
            </main>
          </div>

        </SidebarProvider>
      </TooltipProvider>
    </PlatformProvider>
  );
}
