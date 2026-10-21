import type { CreateProductRequest, CreateSellableProductRequest, ProductFormValue } from "@/features/products/types";
import { ProductContributions } from "../types/catalog.request";
export declare function buildCreateProductRequest(values: ProductFormValue): CreateProductRequest;
export declare function buildCreateSellableProductRequest(values: ProductFormValue, contributions?: ProductContributions): CreateSellableProductRequest;
