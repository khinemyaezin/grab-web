import { type ReactNode } from "react";
import type { HateoasLink } from "@khinemyaezin/seller-api";
export declare function CatalogEntryLinkProvider({ link, children, }: {
    link?: HateoasLink;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useCatalogEntryLink(): HateoasLink | undefined;
