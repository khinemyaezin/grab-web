import type { CatalogRoot } from "@/features/products/types";
export declare function useRoot(): import("@tanstack/react-query").UseQueryResult<CatalogRoot, Error>;
export declare function useCatalogLink(rel: keyof CatalogRoot): import("@khinemyaezin/seller-api").HateoasLink | undefined;
