import { describe, it, expect } from "vitest";
import { expandLink, removeTemplateFromUrl, resolveUrlTemplate } from "./link-resolver.js";
import type { HateoasLink } from "../hateoas.js";

describe("link-resolver template expansion", () => {
  it("expands query templates {?page,size}", () => {
    const link: HateoasLink = {
      href: "/api/v1/products{?page,size}",
      templated: true,
    };
    const result = expandLink(link, { page: "2", size: "20" });
    expect(result.href).toBe("/api/v1/products?page=2&size=20");
    expect(result.remainingParams).toBeUndefined();
  });

  it("expands path templates {/id}", () => {
    const link: HateoasLink = {
      href: "/api/v1/merchants{/id}",
      templated: true,
    };
    const result = expandLink(link, { id: "m-123" });
    expect(result.href).toBe("/api/v1/merchants/m-123");
    expect(result.remainingParams).toBeUndefined();
  });

  it("expands mixed path + query templates", () => {
    const link: HateoasLink = {
      href: "/api/v1/orders/{orderId}/items{?status,sort}",
      templated: true,
    };
    const result = expandLink(link, {
      orderId: "ord-456",
      status: "SHIPPED",
      sort: "desc",
    });
    expect(result.href).toBe("/api/v1/orders/ord-456/items?status=SHIPPED&sort=desc");
    expect(result.remainingParams).toBeUndefined();
  });

  it("preserves non-templated link and passes params as remainingParams", () => {
    const link: HateoasLink = {
      href: "/api/v1/categories",
    };
    const result = expandLink(link, { active: "true", page: "1" });
    expect(result.href).toBe("/api/v1/categories");
    expect(result.remainingParams).toEqual({ active: "true", page: "1" });
  });

  it("partitions template variables from unused query params", () => {
    const link: HateoasLink = {
      href: "/api/v1/facilities/{facilityId}",
      templated: true,
    };
    const result = expandLink(link, {
      facilityId: "fac-99",
      includeInactive: "true",
    });
    expect(result.href).toBe("/api/v1/facilities/fac-99");
    expect(result.remainingParams).toEqual({ includeInactive: "true" });
  });

  it("cleans empty templates when no params are provided", () => {
    const link: HateoasLink = {
      href: "/api/v1/inventory/{itemId}{?warehouse}",
      templated: true,
    };
    const result = expandLink(link);
    expect(result.href).toBe("/api/v1/inventory/");
    expect(result.remainingParams).toBeUndefined();
  });

  it("removeTemplateFromUrl strips templates cleanly", () => {
    const link: HateoasLink = {
      href: "/api/v1/items/{itemId}{?tab}",
      templated: true,
    };
    expect(removeTemplateFromUrl(link)).toBe("/api/v1/items/");
  });

  it("resolveUrlTemplate expands templated links", () => {
    const link: HateoasLink = {
      href: "/api/v1/users/{userId}",
      templated: true,
    };
    const resolved = resolveUrlTemplate({ userId: "u-1" }, link);
    expect(resolved.href).toBe("/api/v1/users/u-1");
  });
});
