import { HateoasLink } from "@khinemyaezin/seller-api";
import { AccessContext, AccessContextSelectionResponse } from "../types";
export declare function useAccessContextList(link?: HateoasLink): import("@tanstack/react-query").UseQueryResult<AccessContext[], Error>;
export declare function useAccessContextSelection(): import("@tanstack/react-query").UseMutationResult<AccessContextSelectionResponse, Error, {
    link: HateoasLink;
}, unknown>;
