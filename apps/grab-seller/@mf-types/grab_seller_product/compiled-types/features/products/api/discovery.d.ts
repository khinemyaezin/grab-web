import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { CatalogRoot } from "@/features/products/types";
export declare function fetchCatalogRoot(api: PlatformApiClient, link: HateoasLink): Promise<CatalogRoot>;
