import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { InventoryRootResponse } from "@/features/inventory/types/inventory.response";

export const inventoryService = {
    getRoot: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>): Promise<InventoryRootResponse>  =>
        api.followLink<InventoryRootResponse>(link, "GET", undefined, undefined, headers)
}
