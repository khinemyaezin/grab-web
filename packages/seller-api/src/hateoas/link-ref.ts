import { SellerDiscoveryApiLinks } from "./api-links.js";

/** @deprecated Use SellerDiscoveryApiLinks instead. */
export const ref = {
    ROOT_INDENTITY: SellerDiscoveryApiLinks.identityRoot,
    ROOT_MERCHANT: SellerDiscoveryApiLinks.merchantRoot,
    ROOT_CATALOG: SellerDiscoveryApiLinks.catalogRoot,
    ROOT_INVENTORY: SellerDiscoveryApiLinks.inventoryRoot,
    ROOT_PRICING: SellerDiscoveryApiLinks.pricingRoot,
    ROOT_WORKFLOWS: SellerDiscoveryApiLinks.workflowsRoot,
    ROOT_SALES_CHANNEL: SellerDiscoveryApiLinks.salesChannelRoot,
} as const;
