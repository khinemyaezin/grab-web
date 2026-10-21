import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import { HateoasLink } from "@khinemyaezin/seller-api";
import "../styles.css";
export default function AppRoutes({ link, platform }: {
    link: HateoasLink;
    platform?: SellerPlatform;
}): import("react").JSX.Element;
