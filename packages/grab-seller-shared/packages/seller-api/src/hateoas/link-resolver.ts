import type { HalLinks, HateoasLink, PaginationLinks } from "../hateoas.js";
import { parseTemplate } from "url-template";

export function resolveLink(
  links: HalLinks | undefined,
  rel: string
): HateoasLink | undefined {
  return links?.[rel];
}

export function hasLink(links: HalLinks | undefined, rel: string): boolean {
  return !!links && !!links[rel];
}

export function resolvePaginationLinks(links: HalLinks | undefined): PaginationLinks | null {
  if (!links || !links.self) return null;

  return {
    self: links.self,
    first: links.first,
    prev: links.prev,
    next: links.next,
    last: links.last,
  };
}

export function resolveUrlTemplate(params: Record<string, string>, link: HateoasLink): HateoasLink {
  if (link?.templated) {
    const url = parseTemplate(link.href);
    return { ...link, href: url.expand(params) }
  } else return link;
}

export function removeTemplateFromUrl(link: HateoasLink):string {
  if (link.templated) {
    const url = parseTemplate(link.href);
    return url.expand({})
  } else return link.href;
}
