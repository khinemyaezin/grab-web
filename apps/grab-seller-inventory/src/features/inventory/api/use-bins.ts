
import { binService } from "./bin";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { BinsFilterForm, CreateBinRequest, UpdateBinRequest } from "@/features/inventory/types";
import type { BinResponse, ListBinResponse } from "@/features/inventory/types/inventory.response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";

export function useBins(link?: HateoasLink, zoneId?: string, filter?: BinsFilterForm & Pageable) {
  const api = useApi();
  return useQuery<ListBinResponse>({
    queryKey: ["bins", zoneId, filter],
    queryFn: () => binService.searchBins(api, link!, { page: 0, size: 20, ...filter, zoneId }),
    enabled: !!zoneId && !!link,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBin(link?: HateoasLink, id?: string) {
  const api = useApi();
  const expandedLink = resolveUrlTemplate({ binId: id! }, link!);
  return useQuery<BinResponse>({
    queryKey: ["bin", id],
    queryFn: () => binService.getBin(api, expandedLink),
    enabled: !!link && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBinMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, { link: HateoasLink; request: CreateBinRequest }>({
    mutationFn: ({ link, request }) => binService.createBin(api, link, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
    },
  });
}

export function useUpdateBinMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, { link: HateoasLink; request: UpdateBinRequest }>({
    mutationFn: ({ link, request }) => binService.updateBin(api, link, request),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", _data.id] });
    },
  });
}

export function useActivateBinMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, HateoasLink>({
    mutationFn: (link) => binService.activate(api, link),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", _data.id] });
    },
  });
}

export function useDeactivateBinMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, HateoasLink>({
    mutationFn: (link) => binService.deactivate(api, link),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", _data.id] });
    },
  });
}

export function useDeleteBinMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, HateoasLink>({
    mutationFn: (link) => binService.removeBin(api, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
    },
  });
}
