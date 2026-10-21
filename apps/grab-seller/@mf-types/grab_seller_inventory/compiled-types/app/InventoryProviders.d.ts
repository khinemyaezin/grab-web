import type { ReactNode } from "react";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
export default function InventoryProviders({ link, platform, children, }: {
    link: HateoasLink;
    platform?: SellerPlatform;
    children: ReactNode;
}): import("react").JSX.Element;
