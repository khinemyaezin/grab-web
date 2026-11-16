import { type HateoasLink } from "@khinemyaezin/seller-api";
import { useApi } from "@khinemyaezin/seller-ui";
import { useQuery } from "@tanstack/react-query";
import type { EntryRootResponse } from "../types/auth.response";

export function useEntryGet(link: HateoasLink) {
  const api = useApi();
  return useQuery<EntryRootResponse>({
    queryKey: ["entry-root", link.href],
    queryFn: () => api.followLink<EntryRootResponse>(link, "GET"),
  });
}
