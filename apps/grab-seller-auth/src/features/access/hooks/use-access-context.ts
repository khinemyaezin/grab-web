import { api, HateoasLink, resolveLink } from "@khinemyaezin/seller-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AccessContext, AccessContextListResponse, AccessContextSelectionResponse } from "../types";

export function useAccessContextList(link?: HateoasLink) {
    return useQuery<AccessContextListResponse, Error, AccessContext[]>({
        queryKey: ["access-context-list", link?.href],
        queryFn: () => api.followLink(link!, "GET",),
        enabled: !!link,
        select: (response) => {
            return (response?._embedded?.accessContextResponseList ?? [])
                .map(context => {
                    return {
                        assignmentId: context.assignmentId,
                        title: context.title,
                        accessLink: resolveLink(context._links, "select-access-context")
                    };
                });
        }
    })
}

export function useAccessContextSelection() {
    return useMutation<AccessContextSelectionResponse, Error, { link: HateoasLink }>({
        mutationFn: ({ link }) => api.followLink(link, "POST")
    })
}