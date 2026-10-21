import { Route, Routes } from "react-router";
import { NotFoundPage } from "@khinemyaezin/seller-ui";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import AccountProviders from "./AccountProviders";
import StorefrontListPage from "@/features/storefront/list/storefront-list-page";
import StorefrontNewPage from "@/features/storefront/new/storefront-new-page";
import StorefrontEditPage from "@/features/storefront/edit/storefront-edit-page";
import "../styles.css";

export default function StorefrontRoutes({
  link,
  platform,
}: {
  link: HateoasLink;
  platform?: SellerPlatform;
}) {
  return (
    <AccountProviders link={link} platform={platform}>
      <Routes>
        <Route index element={<StorefrontListPage />} />
        <Route path="new" element={<StorefrontNewPage />} />
        <Route path=":storefrontId" element={<StorefrontEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AccountProviders>
  );
}
