
import { useQuery } from "@tanstack/react-query";
import { fetchInventoryRoot } from "./discovery";
import type { InventoryRoot } from "@/features/inventory/types";
import { useEntryLink, useApi } from "@khinemyaezin/seller-ui";

export function useRoot() {
  const api = useApi();
  const entryLink = useEntryLink();
  return useQuery<InventoryRoot>({
    queryKey: ["inventory-root", entryLink],
    queryFn: () => fetchInventoryRoot(api, entryLink!),
    enabled: !!entryLink,
    staleTime: Infinity,
  });
}

export function useInventoryLink(rel: keyof InventoryRoot) {
  return useRoot().data?.[rel]
}