import { routes, SellerPlatform } from "@khinemyaezin/seller-contracts";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { NotFoundPage } from "@khinemyaezin/seller-ui";
import { Route, Routes } from "react-router";
import C2cOnboardingPage from "@/features/merchant/c2c-onboarding/c2c-onboarding-page";
import RetailerOnboardingPage from "@/features/merchant/retailer-onboarding/retailer-onboarding-page";
import MerchantSelectionPage from "@/features/merchant/selection/merchant-selection-page";
import AccountProviders from "./AccountProviders";
import "../styles.css";

export default function AppRoutes({ link, platform }: {
  link: HateoasLink;
  platform?: SellerPlatform;
}) {
  return (
    <AccountProviders link={link} platform={platform}>
      <Routes>
        <Route path="" element={<MerchantSelectionPage />} />
        <Route path={routes.individualOnboarding} element={<C2cOnboardingPage />} />
        <Route path={routes.retailerOnboarding} element={<RetailerOnboardingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AccountProviders>
  );
}
