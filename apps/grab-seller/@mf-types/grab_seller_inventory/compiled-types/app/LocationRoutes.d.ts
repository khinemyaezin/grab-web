import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import "../styles-location.css";
export default function LocationRoutes({ link, platform, salesChannelLink, }: {
    link: HateoasLink;
    platform?: SellerPlatform;
    salesChannelLink?: HateoasLink | null;
}): import("react").JSX.Element;
