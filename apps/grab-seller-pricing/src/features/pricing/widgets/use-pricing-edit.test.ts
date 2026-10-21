import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePricingEdit } from "./use-pricing-edit";

const mockUsePricingLink = vi.fn();
const mockUseVariantPriceLinkGet = vi.fn();
const mockUsePriceSetLinkGet = vi.fn();

vi.mock("@/features/pricing/api/use-root", () => ({
  usePricingLink: (...args: unknown[]) => mockUsePricingLink(...args),
}));

vi.mock("@/features/pricing/api/use-price-set", () => ({
  useVariantPriceLinkGet: (...args: unknown[]) => mockUseVariantPriceLinkGet(...args),
  usePriceSetLinkGet: (...args: unknown[]) => mockUsePriceSetLinkGet(...args),
}));

const listLink = { href: "/pricing/variant-price-links" };
const getPriceSetLink = { href: "/price-sets/ps-1" };

function idleQuery() {
  return { data: undefined, isLoading: false, isError: false };
}

function loadingQuery() {
  return { data: undefined, isLoading: true, isError: false };
}

function errorQuery() {
  return { data: undefined, isLoading: false, isError: true };
}

describe("usePricingEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePricingLink.mockReturnValue(listLink);
    mockUseVariantPriceLinkGet.mockReturnValue(idleQuery());
    mockUsePriceSetLinkGet.mockReturnValue(idleQuery());
  });

  it("is loading while a remote price set is fetched", () => {
    mockUseVariantPriceLinkGet.mockReturnValue(loadingQuery());

    const { result } = renderHook(() =>
      usePricingEdit({ variantId: "var-1", contextSku: "SKU-1" }),
    );

    expect(mockUsePricingLink).toHaveBeenCalledWith("listVariantPriceLinks");
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it("is in error when a remote price fetch fails", () => {
    mockUseVariantPriceLinkGet.mockReturnValue(errorQuery());

    const { result } = renderHook(() => usePricingEdit({ variantId: "var-1" }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it("seeds the form from the loaded price set", () => {
    mockUseVariantPriceLinkGet.mockReturnValue({
      data: {
        variantId: "var-1",
        sku: "SKU-REMOTE",
        priceSetId: "ps-1",
        _links: { "get-price-set": getPriceSetLink },
      },
      isLoading: false,
      isError: false,
    });
    mockUsePriceSetLinkGet.mockReturnValue({
      data: {
        id: "ps-1",
        prices: [{ id: "price-1", currencyCode: "EUR", amount: 19.5 }],
      },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() =>
      usePricingEdit({ variantId: "var-1", contextSku: "SKU-CTX" }),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.seed).toEqual({
      sku: "SKU-CTX",
      currencyCode: "EUR",
      amount: 19.5,
      priceSetId: "ps-1",
      priceId: "price-1",
    });
  });

  it("prefers initialValue over the remote amount and skips the loading gate", () => {
    mockUseVariantPriceLinkGet.mockReturnValue(loadingQuery());
    mockUsePriceSetLinkGet.mockReturnValue({
      data: {
        id: "ps-1",
        prices: [{ id: "price-1", currencyCode: "USD", amount: 99 }],
      },
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(() =>
      usePricingEdit({
        variantId: "var-1",
        initialValue: {
          sku: "SKU-DRAFT",
          currencyCode: "USD",
          amount: 7,
        },
      }),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.seed).toEqual({
      sku: "SKU-DRAFT",
      currencyCode: "USD",
      amount: 7,
      priceSetId: "ps-1",
      priceId: "price-1",
    });
  });
});
