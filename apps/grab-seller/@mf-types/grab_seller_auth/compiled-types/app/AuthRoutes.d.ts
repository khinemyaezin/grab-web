import { HateoasLink } from "@khinemyaezin/seller-api";
import { type SellerPlatform } from "@khinemyaezin/seller-contracts";
import "../styles.css";
export default function AuthRoutes({ link, platform }: {
    link: HateoasLink;
    platform?: SellerPlatform;
}): import("react").JSX.Element;
