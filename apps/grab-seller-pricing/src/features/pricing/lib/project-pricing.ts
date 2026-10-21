import {
  PRODUCT_CONTRIBUTION_SLICES,
  type PricingEditPayload,
  type PricingPayload,
  type SlotContribution,
} from "@khinemyaezin/seller-contracts";

export function projectPricingCreate(payload: PricingPayload): SlotContribution[] {
  return [
    {
      slice: PRODUCT_CONTRIBUTION_SLICES.PRICING_LINES,
      append: [
        {
          sku: payload.sku,
          currencyCode: payload.currencyCode,
          amount: payload.amount,
        },
      ],
    },
  ];
}

export function projectPricingEdit(
  payload: PricingEditPayload,
  variantId?: string,
): SlotContribution[] {
  const trimmed = variantId?.trim();
  return [
    {
      slice: PRODUCT_CONTRIBUTION_SLICES.PRICING_LINES,
      append: [
        {
          sku: payload.sku,
          ...(trimmed ? { variantId: trimmed } : {}),
          currencyCode: payload.currencyCode,
          amount: payload.amount,
        },
      ],
    },
  ];
}
