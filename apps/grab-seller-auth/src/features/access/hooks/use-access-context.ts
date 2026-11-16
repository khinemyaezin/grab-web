import { HateoasLink, resolveLink, SellerApiLinks } from "@khinemyaezin/seller-api";
import { useApi } from "@khinemyaezin/seller-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AccessContext, AccessContextListResponse, AccessContextSelectionResponse } from "../types";

export function useAccessContextList(link?: HateoasLink) {
  const api = useApi();
  return useQuery<AccessContextListResponse, Error, AccessContext[]>({
    queryKey: ["access-context-list", link?.href],
    queryFn: () => api.followLink(link!, "GET"),
    enabled: !!link,
    select: (response) => {
      return (response?._embedded?.accessContextResponseList ?? []).map((context) => {
        return {
          assignmentId: context.assignmentId,
          title: context.title,
          accessLink: resolveLink(context._links, SellerApiLinks.session.selectContext),
        };
      });
    },
  });
}

export function useAccessContextSelection() {
  const api = useApi();
  return useMutation<AccessContextSelectionResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => api.followLink(link, "POST"),
  });
}
