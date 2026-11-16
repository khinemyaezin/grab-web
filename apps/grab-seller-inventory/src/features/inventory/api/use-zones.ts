
import { zoneService } from "./zone";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import { CreateZoneRequest, ListZoneResponse, UpdateZoneRequest, ZonesFilterForm } from "@/features/inventory/types";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";

export function useZones(link?: HateoasLink, locationId?: string, filter?: ZonesFilterForm & Pageable) {
  const api = useApi();
  return useQuery<ListZoneResponse>({
    queryKey: ["zones", locationId, filter],
    queryFn: () => zoneService.searchZones(api, link!, { page: 0, size: 20, ...filter, locationId }),
    enabled: !!locationId && !!link,
    staleTime: 1000 * 60 * 5,
  });
}

export function useZone(link?: HateoasLink, id?: string) {
  const api = useApi();
  const expendLink = link && id ? resolveUrlTemplate({ "zoneId": id }, link) : undefined;
  return useQuery<ZoneResponse>({
    queryKey: ["zone", id],
    queryFn: () => zoneService.getZone(api, expendLink!),
    enabled: !!link && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddZoneMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, { link: HateoasLink, request: CreateZoneRequest }>({
    mutationFn: ({ link, request }) => zoneService.createZone(api, link, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useUpdateZoneMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, { link: HateoasLink, request: UpdateZoneRequest }>({
    mutationFn: ({ link, request }) => zoneService.update(api, link, request),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", _data.id] });
    }
  });
}

export function useRemoveZoneMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, HateoasLink>({
    mutationFn: (link) => zoneService.removeZone(api, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useActivateZoneMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, HateoasLink>({
    mutationFn: (link: HateoasLink) => {
      return zoneService.activate(api, link);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", _data.id] });
    },
  });
}

export function useDeactivateZoneMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, HateoasLink>({
    mutationFn: (link) => {
      return zoneService.deactivate(api, link);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", _data.id] });
    },
  });
}
