import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { configureApi } from "@khinemyaezin/seller-api";
import { server } from "@/test/server";
import { fetchInventoryRoot } from "./discovery";

describe("inventory discovery", () => {
  it("maps inventory HAL relations into the Inventory contract", async () => {
    configureApi({ baseUrl: "http://api.test" });
    server.use(http.get("http://api.test/inventory", () => HttpResponse.json({
      _links: {
        self: { href: "/inventory" },
        "search-locations": { href: "/inventory/locations/search" },
        "get-location": { href: "/api/v1/facilities/locations/{locationId}", templated: true },
        "create-location": { href: "/inventory/locations" },
        "search-inventory-items": { href: "/inventory/items/search" },
        "create-inventory-item": { href: "/inventory/items" },
        "get-inventory-item": { href: "/api/v1/inventory/items/{itemId}", templated: true },
        "list-reorder-suggestions": { href: "/api/v1/inventory/reorder-suggestions" },
      },
    }, { headers: { "content-type": "application/hal+json" } })));

    const root = await fetchInventoryRoot({ href: "/inventory" });
    expect(root.searchLocation?.href).toBe("/inventory/locations/search");
    expect(root.location?.href).toBe("/api/v1/facilities/locations/{locationId}");
    expect(root.location?.templated).toBe(true);
    expect(root.searchInventoryItems?.href).toBe("/inventory/items/search");
    expect(root.createInventoryItem?.href).toBe("/inventory/items");
    expect(root.inventoryItem?.href).toBe("/api/v1/inventory/items/{itemId}");
    expect(root.inventoryItem?.templated).toBe(true);
    expect(root.reorderSuggestions?.href).toBe("/api/v1/inventory/reorder-suggestions");
  });
});
