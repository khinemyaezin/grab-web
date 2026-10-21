import { describe, expect, it } from "vitest";
import { isStorefrontSlug, toStorefrontSlug } from "./to-storefront-slug";

describe("toStorefrontSlug", () => {
  it("converts a display name to lowercase kebab-case", () => {
    expect(toStorefrontSlug("Main Shop")).toBe("main-shop");
    expect(toStorefrontSlug("  Yangon Outlet!  ")).toBe("yangon-outlet");
  });

  it("collapses punctuation and whitespace into single hyphens", () => {
    expect(toStorefrontSlug("A -- B__C")).toBe("a-b-c");
  });

  it("returns an empty string when nothing alphanumeric remains", () => {
    expect(toStorefrontSlug("!!!")).toBe("");
  });
});

describe("isStorefrontSlug", () => {
  it("accepts lowercase kebab-case", () => {
    expect(isStorefrontSlug("main-shop")).toBe(true);
    expect(isStorefrontSlug("a")).toBe(true);
  });

  it("rejects uppercase, spaces, and leading hyphens", () => {
    expect(isStorefrontSlug("Main-Shop")).toBe(false);
    expect(isStorefrontSlug("main shop")).toBe(false);
    expect(isStorefrontSlug("-main")).toBe(false);
    expect(isStorefrontSlug("")).toBe(false);
  });
});
