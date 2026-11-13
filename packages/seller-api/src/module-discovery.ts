import { SellerDiscoveryApiLinks } from "./hateoas/api-links.js";

export const ModuleDiscovery = {
    "identity": SellerDiscoveryApiLinks.identityRoot,
    "merchant": SellerDiscoveryApiLinks.merchantRoot,
    "catalog": SellerDiscoveryApiLinks.catalogRoot,
    "inventory": SellerDiscoveryApiLinks.inventoryRoot,
    "pricing": SellerDiscoveryApiLinks.pricingRoot,
    "workflows": SellerDiscoveryApiLinks.workflowsRoot,
    "salesChannel": SellerDiscoveryApiLinks.salesChannelRoot,
} as const; 
export type ModuleDiscoveryType = typeof ModuleDiscovery;
export type ModuleName = keyof ModuleDiscoveryType; 
export type ModuleLink = ModuleDiscoveryType[ModuleName];
