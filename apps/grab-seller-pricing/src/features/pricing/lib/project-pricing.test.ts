import { describe, expect, it } from "vitest";
import { PRODUCT_CONTRIBUTION_SLICES } from "@khinemyaezin/seller-contracts";
import { projectPricingCreate, projectPricingEdit } from "./project-pricing";

describe("projectPricingCreate", () => {
  it("projects a pricing line without a variant id", () => {
    expect(
      projectPricingCreate({
        sku: "SKU-1",
        currencyCode: "USD",
        amount: 12.5,
      }),
    ).toEqual([
      {
        slice: PRODUCT_CONTRIBUTION_SLICES.PRICING_LINES,
        append: [
          {
            sku: "SKU-1",
            currencyCode: "USD",
            amount: 12.5,
          },
        ],
      },
    ]);
  });
});

describe("projectPricingEdit", () => {
  it("includes variantId when it is present", () => {
    expect(
      projectPricingEdit(
        {
          sku: "SKU-2",
          currencyCode: "EUR",
          amount: 9,
          priceSetId: "ps-1",
          priceId: "p-1",
        },
        "var-1",
      ),
    ).toEqual([
      {
        slice: PRODUCT_CONTRIBUTION_SLICES.PRICING_LINES,
        append: [
          {
            sku: "SKU-2",
            variantId: "var-1",
            currencyCode: "EUR",
            amount: 9,
          },
        ],
      },
    ]);
  });

  it("omits variantId when it is blank", () => {
    const payload = {
      sku: "SKU-3",
      currencyCode: "USD",
      amount: 4,
    };

    expect(projectPricingEdit(payload)).toEqual([
      {
        slice: PRODUCT_CONTRIBUTION_SLICES.PRICING_LINES,
        append: [
          {
            sku: "SKU-3",
            currencyCode: "USD",
            amount: 4,
          },
        ],
      },
    ]);
    expect(projectPricingEdit(payload, "   ")).toEqual([
      {
        slice: PRODUCT_CONTRIBUTION_SLICES.PRICING_LINES,
        append: [
          {
            sku: "SKU-3",
            currencyCode: "USD",
            amount: 4,
          },
        ],
      },
    ]);
  });
});
