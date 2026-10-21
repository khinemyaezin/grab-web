import { HateoasLink } from "@khinemyaezin/seller-api";
import { InventoryRootResponse } from "@/features/inventory/types/inventory.response";
export declare const inventoryService: {
    getRoot: (link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryRootResponse>;
};
