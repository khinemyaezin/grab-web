const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const STOREFRONT_SLUG_PATTERN = KEBAB_CASE;
export const STOREFRONT_SLUG_MAX_LENGTH = 255;

export function toStorefrontSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, STOREFRONT_SLUG_MAX_LENGTH);
}

export function isStorefrontSlug(value: string): boolean {
  return KEBAB_CASE.test(value) && value.length <= STOREFRONT_SLUG_MAX_LENGTH;
}
