import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import "../styles.css";
export default function StorefrontRoutes({ link, platform, }: {
    link: HateoasLink;
    platform?: SellerPlatform;
}): import("react").JSX.Element;
