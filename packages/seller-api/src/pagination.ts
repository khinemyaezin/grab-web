export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Pageable {
  page: number,
  size: number
}

export function toPageParams(pageable?: Pageable): Record<string, string> | undefined {
  if (!pageable) return undefined;
  return {
    page: String(pageable.page),
    size: String(pageable.size),
  };
}