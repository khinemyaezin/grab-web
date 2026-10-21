import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
export default function UserMenuWidgetExposed({ platform, identityLink, onLogout, trigger }: {
    platform: SellerPlatform;
    identityLink: HateoasLink;
    onLogout: () => void;
    trigger: React.ReactNode;
}): import("react").JSX.Element | null;
