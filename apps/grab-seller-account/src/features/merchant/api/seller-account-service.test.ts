import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { configureApi } from "@khinemyaezin/seller-api";
import { server } from "@/test/server";
import { createSellerAccountService } from "./seller-account-service";

describe("seller account service", () => {
  it("expands the canonical get-merchant relation with the merchant scope", async () => {
    configureApi({ baseUrl: "http://api.test" });
    server.use(
      http.get("http://api.test/merchants/root", () => HttpResponse.json({
        _links: {
          "get-merchant": {
            href: "/api/v1/merchants/{merchantId}",
            templated: true,
          },
        },
      }, { headers: { "content-type": "application/hal+json" } })),
      http.get("http://api.test/api/v1/merchants/merchant-1", () => HttpResponse.json({
        merchantId: "merchant-1",
        applicantUserId: "user-1",
        type: "C2C_SELLER",
        primaryMarketCountryCode: "SG",
        legalName: "Seller One",
        displayName: "Seller One",
        registration: {},
        contact: {},
        registeredAddress: {},
        status: "ACTIVE",
        lifecycleReason: "",
        reviewedBy: "",
        reviewedAt: "",
        createdAt: "",
        updatedAt: "",
        version: 1,
        _links: {},
      }, { headers: { "content-type": "application/hal+json" } })),
    );

    const service = createSellerAccountService({ href: "/merchants/root" }, "merchant-1");
    const account = await service.getAccount();

    expect(account.merchantId).toBe("merchant-1");
  });

  it("rejects a missing or global merchant scope", async () => {
    configureApi({ baseUrl: "http://api.test" });
    server.use(http.get("http://api.test/merchants/root", () => HttpResponse.json({
      _links: {
        "get-merchant": {
          href: "/api/v1/merchants/{merchantId}",
          templated: true,
        },
      },
    }, { headers: { "content-type": "application/hal+json" } })));

    const service = createSellerAccountService({ href: "/merchants/root" }, "*");

    await expect(service.getAccount()).rejects.toThrow(
      "A merchant-scoped access context is required to load the current merchant",
    );
  });
});
