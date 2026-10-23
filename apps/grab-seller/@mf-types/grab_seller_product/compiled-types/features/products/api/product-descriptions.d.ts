import { type HateoasLink } from "@khinemyaezin/seller-api";
import type { ProductDescription, ReplaceProductDescriptionsRequest } from "@/features/products/types";
export type AttachProductDescriptionsOptions = {
    productId: string;
    items: ProductDescription[];
    seed?: ProductDescription[];
    replaceDescriptionsLink: HateoasLink;
};
export declare function toProductDescriptionFormItems(descriptions: ProductDescription[] | null | undefined): ProductDescription[];
export declare function overviewDescription(descriptions: ProductDescription[] | undefined): string;
export declare function withOverviewDescription(descriptions: ProductDescription[] | undefined, body: string): ProductDescription[];
export declare function toReplaceDescriptionsPayload(descriptions: ProductDescription[] | undefined): ReplaceProductDescriptionsRequest["descriptions"];
export declare function isDescriptionsDirty(items: ProductDescription[] | undefined, seed?: ProductDescription[] | undefined): boolean;
export declare function attachProductDescriptions({ productId, items, seed, replaceDescriptionsLink, }: AttachProductDescriptionsOptions): Promise<void>;
