import { type ReactNode } from "react";
import type { HateoasLink } from "@khinemyaezin/seller-api";
export declare function SalesChannelLinkProvider({ link, children, }: {
    link?: HateoasLink | null;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useSalesChannelLink(): HateoasLink | null;
