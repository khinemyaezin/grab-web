
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@khinemyaezin/seller-ui";
import { locationService } from "./location";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  LocationResponse,
  LocationsResponse,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationsFilterForm,
} from "@/features/inventory/types";
import type { Pageable } from "@khinemyaezin/seller-api";

export function useLocations(locationsLink?: HateoasLink, filters?: LocationsFilterForm & Pageable) {
  const api = useApi();
  return useQuery<LocationsResponse>({
    queryKey: ["locations", locationsLink?.href, filters],
    queryFn: () => locationService.searchLocations(api, locationsLink!, filters),
    enabled: !!locationsLink,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLocation(link?: HateoasLink, locationId?: string) {
  const api = useApi();
  const expendLink = resolveUrlTemplate({ "locationId": locationId! }, link!)
  return useQuery<LocationResponse>({
    queryKey: ["location", locationId],
    queryFn: () => locationService.getLocation(api, expendLink),
    enabled: !!link && !!locationId,
  });
}

export function useCreateLocationMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, { link: HateoasLink, request: CreateLocationRequest }>({
    mutationFn: ({ link: locationsLink, request }) => locationService.createLocation(api, locationsLink, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

export function useUpdateLocationMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, { link: HateoasLink; request: UpdateLocationRequest }>({
    mutationFn: ({ link, request }) => locationService.update(api, link, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", _data.id] });
    },
  });
}

export function useActivateLocationMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, HateoasLink>({
    mutationFn: (link) => locationService.activate(api, link),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", _data.id] });
    },
  });
}

export function useDeactivateLocationMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, HateoasLink>({
    mutationFn: (link) => locationService.deactivate(api, link),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", _data.id] });
    },
  });
}

export function useLinkLocationToChannelMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, { link: HateoasLink; salesChannelId: string }>({
    mutationFn: ({ link, salesChannelId }) => locationService.linkToChannel(api, link, { salesChannelId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", data.id] });
    },
  });
}

export function useUnlinkLocationFromChannelMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, { link: HateoasLink; salesChannelId: string }>({
    mutationFn: ({ link, salesChannelId }) => locationService.unlinkFromChannel(api, link, { salesChannelId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", data.id] });
    },
  });
}

export function useDeleteLocationMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation<void, Error, HateoasLink>({
    mutationFn: (link) => locationService.removeLocation(api, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
