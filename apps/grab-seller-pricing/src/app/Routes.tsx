import { Routes, Route } from "react-router";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { SellerPlatform } from "@khinemyaezin/seller-contracts";
import { PlatformProvider } from "@khinemyaezin/seller-ui";
import PricingPage from "@/features/pricing/pages/pricing-page";

export type RoutesProps = {
  link?: HateoasLink;
  platform?: SellerPlatform;
};

export default function AppRoutes({ link, platform }: RoutesProps) {
  return (
    <PlatformProvider platform={platform}>
      <Routes>
        <Route path="/" element={<PricingPage rootLink={link} />} />
      </Routes>
    </PlatformProvider>
  );
}
