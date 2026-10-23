import type { ProductFormValue } from "@/features/products/types";
export declare function isCatalogFormDirty(dirtyFields: Partial<Record<keyof ProductFormValue, unknown>>, extensionDirty: boolean): boolean;
