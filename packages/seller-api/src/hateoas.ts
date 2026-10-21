export interface HateoasLink {
  href: string;
  templated?: boolean;
}

export interface HateoasPageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export type HalLinks = Record<string, HateoasLink>;

export type PaginationLinks = {
  first?: HateoasLink;
  prev?: HateoasLink;
  self: HateoasLink;
  next?: HateoasLink;
  last?: HateoasLink;
};