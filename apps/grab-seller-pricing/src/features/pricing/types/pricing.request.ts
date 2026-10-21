export type PriceRuleRequest = {
  attribute: string;
  value: string;
  operator?: string | null;
  priority?: number | null;
};

export type UpdatePriceRequest = {
  title?: string | null;
  currencyCode: string;
  amount: number;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  rules?: PriceRuleRequest[] | null;
};
export type ListVariantPriceSetLinksRequest = {
  variantIds: string[];
}