import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { PricingRoot } from "../types";
export declare function fetchPricingRoot(api: PlatformApiClient, link: HateoasLink): Promise<PricingRoot>;
