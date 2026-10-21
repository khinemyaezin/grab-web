import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { configureApi } from "@khinemyaezin/seller-api";
import { server } from "@/test/server";
import { fetchMerchantRoot } from "./discovery";

describe("merchant discovery", () => {
  it("maps merchant HAL relations including storefronts", async () => {
    configureApi({ baseUrl: "http://api.test" });
    server.use(http.get("http://api.test/merchants", () => HttpResponse.json({
      _links: {
        self: { href: "/merchants" },
        "list-merchants": { href: "/merchants/accounts" },
        "get-current-merchant": { href: "/merchants/me" },
        "list-storefronts": { href: "/merchants/storefronts" },
        "create-storefront": { href: "/merchants/storefronts" },
        "get-storefront": { href: "/merchants/storefronts/{id}", templated: true },
      },
    }, { headers: { "content-type": "application/hal+json" } })));

    const root = await fetchMerchantRoot({ href: "/merchants" });
    expect(root.listStorefronts?.href).toBe("/merchants/storefronts");
    expect(root.createStorefront?.href).toBe("/merchants/storefronts");
    expect(root.getStorefront?.href).toBe("/merchants/storefronts/{id}");
    expect(root.getStorefront?.templated).toBe(true);
    expect(root.getCurrentMerchant?.href).toBe("/merchants/me");
  });
});
