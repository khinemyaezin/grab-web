import type { HalLinks, HateoasLink, PaginationLinks } from "../hateoas.js";
import { parseTemplate } from "url-template";
import type { SellerRelation } from "./api-links.js";

export function resolveLink(
  links: HalLinks | undefined,
  rel: SellerRelation,
): HateoasLink | undefined {
  return links?.[rel];
}

export function hasLink(links: HalLinks | undefined, rel: SellerRelation): boolean {
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
  if (link?.templated || link?.href.includes("{")) {
    const url = parseTemplate(link.href);
    return { ...link, href: url.expand(params) };
  } else return link;
}

export function extractTemplateVariableNames(template: string): Set<string> {
  const vars = new Set<string>();
  const matches = template.matchAll(/\{[+#./;?&]?([^}]+)\}/g);
  for (const match of matches) {
    const list = match[1]?.split(",") ?? [];
    for (const item of list) {
      const clean = item.replace(/(\*|:\d+)$/, "").trim();
      if (clean) vars.add(clean);
    }
  }
  return vars;
}

export type ExpandedLinkResult = {
  href: string;
  remainingParams?: Record<string, string>;
};

export function expandLink(link: HateoasLink, params?: Record<string, string>): ExpandedLinkResult {
  const isTemplated = Boolean(link?.templated || link?.href.includes("{"));

  if (!isTemplated) {
    return {
      href: link.href,
      remainingParams: params,
    };
  }

  if (!params || Object.keys(params).length === 0) {
    try {
      const expanded = parseTemplate(link.href).expand({});
      return { href: expanded };
    } catch {
      return { href: removeTemplateFromUrl(link) };
    }
  }

  const templateVars = extractTemplateVariableNames(link.href);
  const templateParams: Record<string, string> = {};
  const remainingParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (templateVars.has(key)) {
      templateParams[key] = value;
    } else {
      remainingParams[key] = value;
    }
  }

  try {
    const expanded = parseTemplate(link.href).expand(templateParams);
    return {
      href: expanded,
      remainingParams: Object.keys(remainingParams).length > 0 ? remainingParams : undefined,
    };
  } catch {
    return {
      href: removeTemplateFromUrl(link),
      remainingParams: params,
    };
  }
}

export function removeTemplateFromUrl(link: HateoasLink): string {
  if (link.templated || link.href.includes("{")) {
    const url = parseTemplate(link.href);
    return url.expand({});
  } else return link.href;
}
