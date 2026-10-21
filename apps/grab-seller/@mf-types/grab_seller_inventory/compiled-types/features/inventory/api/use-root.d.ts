import type { InventoryRoot } from "@/features/inventory/types";
export declare function useRoot(): import("@tanstack/react-query").UseQueryResult<InventoryRoot, Error>;
export declare function useInventoryLink(rel: keyof InventoryRoot): import("@khinemyaezin/seller-api").HateoasLink | undefined;
