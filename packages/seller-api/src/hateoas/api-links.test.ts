import { describe, expect, it } from "vitest";
import {
  PendingSellerApiLinks,
  SellerApiLinks,
  SellerAuthApiLinks,
  SellerDiscoveryApiLinks,
  SellerMerchantApiLinks,
  SellerSessionApiLinks,
} from "./api-links.js";

function relationValues(): string[] {
  return [
    ...Object.values(SellerApiLinks.discovery),
    ...Object.values(SellerApiLinks.auth),
    ...Object.values(SellerApiLinks.session),
    ...Object.values(SellerApiLinks.merchant),
    ...Object.values(SellerApiLinks.merchantApplication),
    ...Object.values(SellerApiLinks.merchantMember),
    ...Object.values(SellerApiLinks.facility),
    ...Object.values(SellerApiLinks.inventory),
    ...Object.values(SellerApiLinks.reorderSuggestion),
    ...Object.values(SellerApiLinks.category),
    ...Object.values(SellerApiLinks.product),
    ...Object.values(SellerApiLinks.variantOption),
    ...Object.values(SellerApiLinks.pricing),
    ...Object.values(SellerApiLinks.salesChannel),
    ...Object.values(SellerApiLinks.publishableKey),
    ...Object.values(SellerApiLinks.region),
    ...Object.values(SellerApiLinks.storefront),
    ...Object.values(SellerApiLinks.workflow),
    ...Object.values(SellerApiLinks.allocation),
  ];
}

describe("SellerApiLinks", () => {
  it("defines canonical renamed relations", () => {
    expect(SellerApiLinks.auth.refresh).toBe("refresh");
    expect(SellerApiLinks.facility.getLocation).toBe("get-location");
    expect(SellerApiLinks.inventory.getInventoryItem).toBe("get-inventory-item");
    expect(SellerApiLinks.reorderSuggestion.listSuggestions).toBe("list-reorder-suggestions");
    expect(SellerApiLinks.merchant.updateMerchantProfile).toBe("update-merchant-profile");
    expect(SellerApiLinks.session.selectContext).toBe("select-context");
    expect(SellerApiLinks.merchant.getMerchant).toBe("get-merchant");
  });

  it("defines discovery root relations and the standard self relation", () => {
    expect(SellerDiscoveryApiLinks.self).toBe("self");
    expect(SellerDiscoveryApiLinks.identityRoot).toBe("get-identity-root");
    expect(SellerDiscoveryApiLinks.merchantRoot).toBe("get-merchant-root");
  });

  it("keeps canonical relation values unique", () => {
    const values = relationValues();
    expect(new Set(values).size).toBe(values.length);
  });

  it("keeps pending web-only relations separate from canonical relations", () => {
    const canonical = new Set(relationValues());
    const pending = Object.values(PendingSellerApiLinks);

    expect(pending).toContain("event-stream");
    expect(pending).toContain("list-variant-price-links");
    expect(pending.some((rel) => canonical.has(rel))).toBe(false);
    expect(SellerAuthApiLinks.refresh).not.toBe("refresh-token");
    expect(SellerMerchantApiLinks.getMerchant).not.toBe("get-current-merchant");
    expect(SellerSessionApiLinks.selectContext).not.toBe("select-access-context");
  });
});
