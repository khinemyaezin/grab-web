import { api, type HateoasLink } from "@khinemyaezin/seller-api";
import { useQuery } from "@tanstack/react-query";
import type { EntryRootResponse } from "../types/auth.response";

export function useEntryGet(link: HateoasLink) {
  return useQuery<EntryRootResponse>({
    queryKey: ["entry-root", link.href],
    queryFn: () => api.followLink<EntryRootResponse>(link, "GET"),
  });
}
