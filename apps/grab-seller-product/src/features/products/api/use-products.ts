import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";
import { catalogService } from ".";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  CreateSellableProductRequest,
  CreateSellableProductResponse,
  GetFullProductResponse,
  GetVariantRequest,
  GetVariantResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  UpdateSellableProductRequest,
  UpdateSellableProductResponse,
  UpdateProductVariantRequest,
  UpdateProductVariantResponse,
  ProductModerationResponse,
  DeleteProductResponse,
  ProductFilterFormValue,
  ProductPublicationResponse,
} from "@/features/products/types";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import { ProductSearchRequest } from "@/features/products/types/catalog.request";
import { ProductSearchResponse } from "@/features/products/types/catalog.response";

export function invalidateProductsQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ["products"] });
}

export function invalidateProductDetailQueries(queryClient: QueryClient, productId: string) {
  return queryClient.invalidateQueries({ queryKey: ["product", productId] });
}

export function invalidateProductQueries(queryClient: QueryClient, productId?: string) {
  const promises = [invalidateProductsQueries(queryClient)];
  if (productId) {
    promises.push(invalidateProductDetailQueries(queryClient, productId));
  }
  return Promise.all(promises);
}

export function useCreateSellableProductMutation() {
  const api = useApi();
  return useMutation<
    CreateSellableProductResponse,
    Error,
    { link: HateoasLink; request: CreateSellableProductRequest }
  >({
    mutationFn: ({ link, request }) => catalogService.createSellableProduct(api, link, request),
  });
}

export function useUpdateSellableProductMutation() {
  const api = useApi();
  return useMutation<
    UpdateSellableProductResponse,
    Error,
    { link: HateoasLink; request: UpdateSellableProductRequest }
  >({
    mutationFn: ({ link, request }) => catalogService.updateSellableProduct(api, link, request),
  });
}

export function useUpdateProductVariantMutation() {
  const api = useApi();
  return useMutation<
    UpdateProductVariantResponse,
    Error,
    { link: HateoasLink; request: UpdateProductVariantRequest }
  >({
    mutationFn: ({ link, request }) => catalogService.updateProductVariant(api, link, request),
  });
}

export function useProductUpdateMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<
    UpdateProductResponse,
    Error,
    { link: HateoasLink; request: UpdateProductRequest }
  >({
    mutationFn: ({ link, request }) => catalogService.updateProduct(api, link, request),
    onSuccess: () => {
      invalidateProductsQueries(queryClient);
    },
  });
}

export function useProductDeleteMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<DeleteProductResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => catalogService.deleteProduct(api, link),
    onSuccess: (resp) => {
      invalidateProductQueries(queryClient, resp.productId);
    },
  });
}

export function useProductRestoreMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<ProductModerationResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => catalogService.restoreProduct(api, link),
    onSuccess: (resp) => {
      invalidateProductQueries(queryClient, resp.productId);
    },
  });
}

export function useProductVariantDeleteMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { link: HateoasLink; productId?: string }>({
    mutationFn: ({ link }) => catalogService.deleteProductVariant(api, link),
    onSuccess: (_, variables) => {
      invalidateProductsQueries(queryClient);
      if (variables.productId) {
        invalidateProductDetailQueries(queryClient, variables.productId);
      }
    },
  });
}

export function useProductVariantRestoreMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { link: HateoasLink; productId?: string }>({
    mutationFn: ({ link }) => catalogService.restoreProductVariant(api, link),
    onSuccess: (_, variables) => {
      invalidateProductsQueries(queryClient);
      if (variables.productId) {
        invalidateProductDetailQueries(queryClient, variables.productId);
      }
    },
  });
}

export function useProductSearch(productsLink: HateoasLink, filters: ProductFilterFormValue) {
  const api = useApi();
  const request: ProductSearchRequest = {
    ...filters,
    productStatus: filters.productStatus || undefined,
  };
  return useQuery<ProductSearchResponse>({
    queryKey: ["products", "search", productsLink?.href, filters],
    queryFn: async () => catalogService.searchProducts(api, productsLink!, request),
    enabled: !!productsLink,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductGet(productLink: HateoasLink | undefined, productId: string) {
  const api = useApi();
  const extendedLink = productLink && resolveUrlTemplate({ productId }, productLink);
  return useQuery<GetFullProductResponse, Error>({
    queryKey: ["product", productId],
    queryFn: async () => catalogService.getFullProduct(api, extendedLink!),
    enabled: !!productLink,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductVariantGet(
  variantLink: HateoasLink | undefined,
  request: GetVariantRequest,
) {
  const api = useApi();
  const extendedLink =
    variantLink &&
    resolveUrlTemplate({ productId: request.productId, variantId: request.variantId }, variantLink);
  return useQuery<GetVariantResponse, Error>({
    queryKey: ["product", request.productId, "variant", request.variantId],
    queryFn: async () => catalogService.getVariant(api, extendedLink!),
    enabled: !!variantLink && !!request.productId && !!request.variantId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductPublishMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<ProductModerationResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => catalogService.publishProduct(api, link),
    onSuccess: (resp) => {
      invalidateProductQueries(queryClient, resp.productId);
    },
  });
}

export function useProductSuspendMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<ProductModerationResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => catalogService.suspendProduct(api, link),
    onSuccess: (resp) => {
      invalidateProductQueries(queryClient, resp.productId);
    },
  });
}
