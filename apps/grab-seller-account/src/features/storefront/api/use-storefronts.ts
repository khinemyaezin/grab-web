import type { QueryClient } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  CreateStorefrontRequest,
  StorefrontLifecycleRequest,
  StorefrontResponse,
  StorefrontsResponse,
  UpdateStorefrontProfileRequest,
} from "@/features/storefront/types";
import { storefrontService } from "./storefront";

export function invalidateStorefrontsQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ["storefronts"] });
}

export function invalidateStorefrontQueries(queryClient: QueryClient, storefrontId?: string) {
  const promises = [invalidateStorefrontsQueries(queryClient)];
  if (storefrontId) {
    promises.push(queryClient.invalidateQueries({ queryKey: ["storefront", storefrontId] }));
  }
  return Promise.all(promises);
}

export function useStorefronts(link?: HateoasLink) {
  return useQuery<StorefrontsResponse>({
    queryKey: ["storefronts", link?.href],
    queryFn: () => storefrontService.list(link!),
    enabled: !!link,
  });
}

export function useStorefront(link?: HateoasLink, storefrontId?: string) {
  const expanded = link && storefrontId
    ? resolveUrlTemplate({ id: storefrontId }, link)
    : undefined;

  return useQuery<StorefrontResponse>({
    queryKey: ["storefront", storefrontId],
    queryFn: () => storefrontService.get(expanded!),
    enabled: !!expanded && !!storefrontId,
  });
}

export function useCreateStorefrontMutation() {
  const queryClient = useQueryClient();
  return useMutation<StorefrontResponse, Error, { link: HateoasLink; request: CreateStorefrontRequest }>({
    mutationFn: ({ link, request }) => storefrontService.create(link, request),
    onSuccess: () => {
      void invalidateStorefrontsQueries(queryClient);
    },
  });
}

export function useUpdateStorefrontMutation() {
  const queryClient = useQueryClient();
  return useMutation<StorefrontResponse, Error, { link: HateoasLink; request: UpdateStorefrontProfileRequest }>({
    mutationFn: ({ link, request }) => storefrontService.update(link, request),
    onSuccess: (data) => {
      void invalidateStorefrontQueries(queryClient, data.storefrontId);
    },
  });
}

export function useActivateStorefrontMutation() {
  const queryClient = useQueryClient();
  return useMutation<StorefrontResponse, Error, HateoasLink>({
    mutationFn: (link) => storefrontService.activate(link),
    onSuccess: (data) => {
      void invalidateStorefrontQueries(queryClient, data.storefrontId);
    },
  });
}

export function useReactivateStorefrontMutation() {
  const queryClient = useQueryClient();
  return useMutation<StorefrontResponse, Error, HateoasLink>({
    mutationFn: (link) => storefrontService.reactivate(link),
    onSuccess: (data) => {
      void invalidateStorefrontQueries(queryClient, data.storefrontId);
    },
  });
}

export function useSuspendStorefrontMutation() {
  const queryClient = useQueryClient();
  return useMutation<StorefrontResponse, Error, { link: HateoasLink; request: StorefrontLifecycleRequest }>({
    mutationFn: ({ link, request }) => storefrontService.suspend(link, request),
    onSuccess: (data) => {
      void invalidateStorefrontQueries(queryClient, data.storefrontId);
    },
  });
}

export function useCloseStorefrontMutation() {
  const queryClient = useQueryClient();
  return useMutation<StorefrontResponse, Error, { link: HateoasLink; request: StorefrontLifecycleRequest }>({
    mutationFn: ({ link, request }) => storefrontService.close(link, request),
    onSuccess: (data) => {
      void invalidateStorefrontQueries(queryClient, data.storefrontId);
    },
  });
}
