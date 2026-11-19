import { ChevronsUpDown, LayoutGrid, ShoppingBag, Store } from "lucide-react";
import React from "react";
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
import { routes } from "@khinemyaezin/seller-contracts";
import { UserMenu } from "./UserMenu";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      title: "Catalog",
      url: `/`,
      icon: Store,
      items: [
        {
          title: "Product",
          url: `/${routes.products}`,
        },
      ],
    },
    {
      title: "Inventory",
      url: `/${routes.inventory}`,
      icon: LayoutGrid,
      items: [
        {
          title: "Locations",
          url: `/${routes.locations}`,
        },
        {
          title: "Stock",
          url: `/${routes.stock}`,
        },
      ],
    },
    {
      title: "Storefronts",
      url: `/${routes.storefronts}`,
      icon: ShoppingBag,
      items: [],
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
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
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <UserMenu
                user={user}
                onLogout={logout}
                trigger={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <UserAvatarDetails avatar={user.avatar} email={user.email} />
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
