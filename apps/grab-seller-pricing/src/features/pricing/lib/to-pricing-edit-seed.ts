import type { PricingEditPayload } from "@khinemyaezin/seller-contracts";

export type PricingEditPriceSeed = {
  id?: string;
  currencyCode?: string;
  amount?: number;
};

export type ToPricingEditSeedInput = {
  initialValue?: PricingEditPayload;
  contextSku?: string;
  sku?: string;
  price?: PricingEditPriceSeed;
  priceSetId?: string;
};

export function toPricingEditSeed({
  initialValue,
  contextSku,
  sku,
  price,
  priceSetId,
}: ToPricingEditSeedInput): PricingEditPayload {
  if (initialValue) {
    return {
      ...initialValue,
      priceSetId: initialValue.priceSetId ?? priceSetId,
      priceId: initialValue.priceId ?? price?.id,
    };
  }

  return {
    sku: contextSku ?? sku ?? "",
    currencyCode: price?.currencyCode || "USD",
    amount: price?.amount ?? 0,
    priceSetId,
    priceId: price?.id,
  };
}
