import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { InventoryRoot } from "@/features/inventory/types";
export declare function fetchInventoryRoot(api: PlatformApiClient, link: HateoasLink): Promise<InventoryRoot>;
