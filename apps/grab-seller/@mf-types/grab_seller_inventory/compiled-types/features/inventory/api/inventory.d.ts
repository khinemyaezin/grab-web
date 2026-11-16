import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { InventoryRootResponse } from "@/features/inventory/types/inventory.response";
export declare const inventoryService: {
    getRoot: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryRootResponse>;
};
