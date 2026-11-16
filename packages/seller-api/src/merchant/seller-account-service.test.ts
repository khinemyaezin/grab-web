import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSellerAccountService } from "./seller-account-service.js";
import { fetchMerchantRoot } from "./discovery.js";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "../hateoas.js";
import type { MerchantRoot, SellerAccount } from "./types.js";

vi.mock("./discovery.js", () => ({
  fetchMerchantRoot: vi.fn(),
}));

describe("seller account service", () => {
  const mockApi = {
    followLink: vi.fn(),
  } as unknown as PlatformApiClient;

  const mockEntryLink: HateoasLink = { href: "/merchants/root" };
  const mockMerchantRoot: MerchantRoot = {
    getMerchant: {
      href: "/api/v1/merchants/{merchantId}",
      templated: true,
    },
  };

  const sampleAccount: SellerAccount = {
    merchantId: "merchant-1",
    applicantUserId: "user-1",
    type: "FIRST_PARTY_RETAILER",
    legalName: "Grab Mart SG Pte Ltd",
    displayName: "Grab Mart SG",
    status: "ACTIVE",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("expands the canonical get-merchant relation with the merchant scope", async () => {
    vi.mocked(fetchMerchantRoot).mockResolvedValueOnce(mockMerchantRoot);
    vi.mocked(mockApi.followLink).mockResolvedValueOnce(sampleAccount);

    const service = createSellerAccountService(mockApi, mockEntryLink, "merchant-1");
    const account = await service.getAccount();

    expect(fetchMerchantRoot).toHaveBeenCalledWith(mockApi, mockEntryLink);
    expect(mockApi.followLink).toHaveBeenCalledWith(
      { href: "/api/v1/merchants/merchant-1", templated: true },
      "GET",
    );
    expect(account.merchantId).toBe("merchant-1");
  });

  it("rejects a missing or global merchant scope", async () => {
    vi.mocked(fetchMerchantRoot).mockResolvedValueOnce(mockMerchantRoot);

    const service = createSellerAccountService(mockApi, mockEntryLink, "*");

    await expect(service.getAccount()).rejects.toThrow(
      "A merchant-scoped access context is required to load the current merchant",
    );
  });

  it("rejects when merchantId is undefined", async () => {
    vi.mocked(fetchMerchantRoot).mockResolvedValueOnce(mockMerchantRoot);

    const service = createSellerAccountService(mockApi, mockEntryLink, undefined);

    await expect(service.getAccount()).rejects.toThrow(
      "A merchant-scoped access context is required to load the current merchant",
    );
  });

  it("throws if merchant root does not expose get-merchant", async () => {
    vi.mocked(fetchMerchantRoot).mockResolvedValueOnce({});

    const service = createSellerAccountService(mockApi, mockEntryLink, "merchant-1");

    await expect(service.getAccount()).rejects.toThrow(
      "Merchant root does not expose a 'get-merchant' link",
    );
  });
});
