import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import "../styles-location.css";
export default function LocationRoutes({ link, platform, }: {
    link: HateoasLink;
    platform?: SellerPlatform;
}): import("react").JSX.Element;
