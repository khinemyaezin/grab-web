import { api, resolveLink, SellerApiLinks, type HateoasLink } from "@khinemyaezin/seller-api";
import type { InventoryRoot } from "@/features/inventory/types";
import { InventoryRootResponse } from "@/features/inventory/types/inventory.response";

export async function fetchInventoryRoot(link: HateoasLink): Promise<InventoryRoot> {
  const response = await api.followLink<InventoryRootResponse>(link)

  return {
    self: resolveLink(response._links, SellerApiLinks.discovery.self),
    searchLocation: resolveLink(response._links, SellerApiLinks.pending.searchLocations),
    location: resolveLink(response._links, SellerApiLinks.facility.getLocation),
    createLocation: resolveLink(response._links, SellerApiLinks.facility.createLocation),
    searchInventoryItems: resolveLink(response._links, SellerApiLinks.pending.searchInventoryItems),
    createInventoryItem: resolveLink(response._links, SellerApiLinks.inventory.createInventoryItem),
    inventoryItem: resolveLink(response._links, SellerApiLinks.inventory.getInventoryItem),
    checkInventoryExistence: resolveLink(response._links, SellerApiLinks.pending.checkInventoryItemsExistence),
    inventorySummary: resolveLink(response._links, SellerApiLinks.pending.inventorySummary),
    searchProductVariants: resolveLink(response._links, SellerApiLinks.pending.searchProductVariants),
    reorderSuggestions: resolveLink(response._links, SellerApiLinks.reorderSuggestion.listSuggestions),
  };
}
