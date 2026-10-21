import { Routes, Route } from "react-router";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import PricingPage from "@/features/pricing/pages/pricing-page";

export type RoutesProps = {
  link?: HateoasLink;
  platform?: any;
};

export default function AppRoutes({ link, platform }: RoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<PricingPage rootLink={link} />} />
    </Routes>
  );
}
