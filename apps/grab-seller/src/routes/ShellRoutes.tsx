import { Route, Routes } from "react-router";
import { routes } from "@khinemyaezin/seller-contracts";
import { DashboardLayout } from "../components/DashboardLayout";
import { SimpleLayout } from "../components/SimpleLayout";
import DashboardPage from "../pages/DashboardPage";
import { CatalogRemote } from "./catalog";
import {
  InventoryDashboardRemote,
  InventoryLocationsRemote,
  InventoryStockRemote,
} from "./inventory";
import { AccountRemote, StorefrontRemote } from "./account";
import { AuthRemote } from "./auth";
import { RequireAuth } from "./RequireAuth";

export function ShellRoutes() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path={routes.home} element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path={`/${routes.products}/*`} element={<CatalogRemote />} />
          <Route path={`/${routes.storefronts}/*`} element={<StorefrontRemote />} />
          <Route path={`/${routes.inventory}/*`} element={<InventoryDashboardRemote />} />
          <Route path={`/${routes.locations}/*`} element={<InventoryLocationsRemote />} />
          <Route path={`/${routes.stock}/*`} element={<InventoryStockRemote />} />
        </Route>
      </Route>
      <Route element={<SimpleLayout />}>
        <Route path="/onboarding/*" element={<AccountRemote />} />
        <Route path="/*" element={<AuthRemote />} />
      </Route>
    </Routes>
  );
}
