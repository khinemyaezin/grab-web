import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { IdentityLinks } from "@/features/shared/types/identity-model";
import { useEntryLink } from "@khinemyaezin/seller-ui";
import { linkDiscoveryService } from "../api/link-discovery";

export function useIdentityGet(): UseQueryResult<IdentityLinks, Error> {
    const entryLink = useEntryLink();

    return useQuery({
        queryKey: ["identity-root", entryLink.href],
        queryFn: async () => linkDiscoveryService.root(entryLink),
        enabled: !!entryLink,
    });
}