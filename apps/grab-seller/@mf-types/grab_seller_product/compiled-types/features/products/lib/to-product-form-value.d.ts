import type { GetFullProductResponse, ProductFormValue, ProductMedia, ProductMediaFormItem } from "@/features/products/types";
export declare function toProductMediaFormItems(medias: ProductMedia[] | null | undefined): ProductMediaFormItem[];
export declare function transformProductToFormValue(apiData: GetFullProductResponse): ProductFormValue;
