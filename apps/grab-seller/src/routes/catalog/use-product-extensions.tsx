import { lazy, useMemo, type ComponentType } from "react";
import { PRODUCT_EXTENSION_SLOTS, type SellerPlatform } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "@khinemyaezin/seller-api";

const PRODUCT_EXTENSION_WIDGETS = [
  {
    slot: PRODUCT_EXTENSION_SLOTS.CREATE_PRICING,
    Widget: lazy(() => import("grab_seller_pricing/PricingCreateWidget")),
    module: "pricing",
  },
  {
    slot: PRODUCT_EXTENSION_SLOTS.EDIT_PRICING,
    Widget: lazy(() => import("grab_seller_pricing/PricingEditWidget")),
    module: "pricing",
  },
  {
    slot: PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY,
    Widget: lazy(() => import("grab_seller_inventory/ProductInventoryWidget")),
    module: "inventory",
  },
  {
    slot: PRODUCT_EXTENSION_SLOTS.EDIT_INVENTORY,
    Widget: lazy(() => import("grab_seller_inventory/InventoryItemEditWidget")),
    module: "inventory",
  },
] as const;

export type UseProductExtensionsParams = {
  platform: SellerPlatform;
  pricingLink?: HateoasLink | null;
  inventoryLink?: HateoasLink | null;
};

export function useProductExtensions({
  platform,
  pricingLink,
  inventoryLink,
}: UseProductExtensionsParams): Record<string, ComponentType<any>> {
  return useMemo<Record<string, ComponentType<any>>>(() => {
    const links = {
      pricing: pricingLink,
      inventory: inventoryLink,
    };

    return Object.fromEntries(
      PRODUCT_EXTENSION_WIDGETS.map(({ slot, Widget: WidgetLazy, module }) => [
        slot,
        (props: Record<string, unknown>) => {
          const Widget = WidgetLazy as ComponentType<any>;
          return (
            <Widget {...props} platform={platform} entryLink={links[module]!} />
          );
        },
      ]),
    );
  }, [platform, pricingLink, inventoryLink]);
}
