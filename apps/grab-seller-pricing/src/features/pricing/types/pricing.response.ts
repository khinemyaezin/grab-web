import type { HalLinks } from "@khinemyaezin/seller-api";

export interface PricingRootResponse {
  _links: HalLinks;
}

export type PriceRuleResponse = {
  id: string;
  attribute: string;
  value: string;
  operator: string;
  priority: number;
};

export type PriceResponse = {
  id: string;
  title?: string | null;
  currencyCode: string;
  amount: number;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  priceSetId?: string;
  priceListId?: string | null;
  rules?: PriceRuleResponse[];
};

export type PriceSetResponse = {
  id: string;
  prices: PriceResponse[];
  _links?: HalLinks;
};

export type VariantPriceSetLinkResponse = {
  variantId: string;
  priceSetId: string;
  productId: string;
  sku: string;
  merchantId: string;
  _links?: HalLinks;
};

export type VariantPriceSetLinksResponse = {
  _embedded?: {
    variantPriceSetLinkResponseList?: VariantPriceSetLinkResponse[]
  },
  _links?: HalLinks;
};
