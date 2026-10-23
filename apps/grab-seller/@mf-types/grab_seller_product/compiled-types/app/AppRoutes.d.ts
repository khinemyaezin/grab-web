import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { ExtensionRegistry } from "@khinemyaezin/seller-ui";
import "../styles.css";
export type AppRoutesProps = {
    link: HateoasLink;
    platform?: SellerPlatform;
    extensions?: ExtensionRegistry;
    salesChannelLink?: HateoasLink | null;
};
export default function AppRoutes({ link, platform, extensions, salesChannelLink, }: AppRoutesProps): import("react").JSX.Element;
