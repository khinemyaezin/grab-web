import { useMemo } from "react";
import { resolveLink } from "@khinemyaezin/seller-api";
import type { PricingEditPayload } from "@khinemyaezin/seller-contracts";
import { usePricingLink } from "@/features/pricing/api/use-root";
import { usePriceSetLinkGet, useVariantPriceLinkGet } from "@/features/pricing/api/use-price-set";
import { toPricingEditSeed } from "@/features/pricing/lib/to-pricing-edit-seed";

export type UsePricingEditOptions = {
  variantId?: string;
  contextSku?: string;
  initialValue?: PricingEditPayload;
};

export function usePricingEdit({
  variantId,
  contextSku,
  initialValue,
}: UsePricingEditOptions) {
  const trimmedVariantId = variantId?.trim();
  const listLink = usePricingLink("listVariantPriceLinks");
  const priceSetByVariantId = useVariantPriceLinkGet(listLink, trimmedVariantId);
  const getPriceSetLink = resolveLink(priceSetByVariantId.data?._links, "get-price-set");
  const priceSetQuery = usePriceSetLinkGet(getPriceSetLink);

  const price = priceSetQuery.data?.prices?.[0];
  const priceSetId = priceSetQuery.data?.id ?? priceSetByVariantId.data?.priceSetId;
  const sku = priceSetByVariantId.data?.sku;

  const seed = useMemo(
    () =>
      toPricingEditSeed({
        initialValue,
        contextSku,
        sku,
        price,
        priceSetId,
      }),
    [contextSku, initialValue, price, priceSetId, sku],
  );

  const waitingOnRemote = Boolean(trimmedVariantId) && !initialValue;

  return {
    seed,
    isLoading: waitingOnRemote && (priceSetByVariantId.isLoading || priceSetQuery.isLoading),
    isError: waitingOnRemote && (priceSetByVariantId.isError || priceSetQuery.isError),
  };
}
