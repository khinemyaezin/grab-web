import { Route, Routes } from "react-router";
import LoginPage from "../features/auth/pages/login-page";
import RegisterPage from "../features/auth/pages/register-page";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { routes, type SellerPlatform } from "@khinemyaezin/seller-contracts";
import "../styles.css";
import { EntryLinkProvider, PlatformProvider, NotFoundPage } from "@khinemyaezin/seller-ui";
import AccessContextSelectionPage from "@/features/access/pages/access-context-selection-page";

export default function AuthRoutes({ link, platform }: {
  link: HateoasLink;
  platform?: SellerPlatform;
}) {
  return (
    <div className="seller-auth-mfe">
      <PlatformProvider platform={platform}>
        <EntryLinkProvider link={link}>
          <Routes>
            <Route path={routes.login} element={<LoginPage />} />
            <Route path={routes.register} element={<RegisterPage />} />
            <Route path={routes.contextSelection} element={<AccessContextSelectionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </EntryLinkProvider>
      </PlatformProvider>
    </div>
  );
}
