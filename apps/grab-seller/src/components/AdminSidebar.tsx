import { ChevronsUpDown, LayoutGrid, ShoppingBag, Store } from "lucide-react";
import React, { Suspense, lazy } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@khinemyaezin/seller-ui/components/sidebar";
import { NavItem, NavMain, UserAvatarDetails } from "@khinemyaezin/seller-ui";
import { useAuth } from "../app/AuthContext";
import { useEntryLink } from "../app/EntryLinkContext";
import { routes } from "@khinemyaezin/seller-contracts";

const RemoteUserMenuWidget = lazy(() => import("grab_seller_auth/UserMenuWidget"));

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { platform, user, logout } = useAuth();
  const identityLink = useEntryLink("identity");

  const navItems: NavItem[] = [
    {
      title: "Catalog",
      url: `/`,
      icon: Store as any,
      items: [
        {
          title: "Product",
          url: `/${routes.products}`,
        }
      ]
    },
    {
      title: "Inventory",
      url: `/${routes.inventory}`,
      icon: LayoutGrid as any,
      items: [
        {
          title: "Locations",
          url: `/${routes.locations}`,
        },
        {
          title: "Stock",
          url: `/${routes.stock}`,
        }
      ]
    },
    {
      title: "Storefronts",
      url: `/${routes.storefronts}`,
      icon: ShoppingBag as any,
      items: []
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="sidebar"
      {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <span className="truncate font-medium">Seller Central</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Menu" items={navItems} />
      </SidebarContent>
      <SidebarFooter className="p-3">
        {user && identityLink && (
          <SidebarMenu>
            <SidebarMenuItem>
              <Suspense fallback={<div className="h-12 w-full animate-pulse bg-sidebar-accent rounded-lg" />}>
                <RemoteUserMenuWidget
                  onLogout={logout}
                  platform={platform}
                  identityLink={identityLink}
                  trigger={
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <UserAvatarDetails avatar={(user as any).avatar} email={user.email} />
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  }
                />
              </Suspense>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

