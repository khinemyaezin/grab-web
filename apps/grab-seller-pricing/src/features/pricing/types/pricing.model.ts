import type { HateoasLink } from "@khinemyaezin/seller-api";

export interface PricingRoot {
  self?: HateoasLink;
  createPriceSet?: HateoasLink;
  calculatePrices?: HateoasLink;
  listVariantPriceLinks?: HateoasLink;
}
