import { HateoasLink } from "@khinemyaezin/seller-api";
import { AccessContextListResponse, AccessContextSelectionResponse } from "../types";
export declare function useAccessContextList(link?: HateoasLink): import("@tanstack/react-query").UseQueryResult<AccessContextListResponse, Error>;
export declare function useAccessContextSelection(): import("@tanstack/react-query").UseMutationResult<AccessContextSelectionResponse, Error, {
    link: HateoasLink;
}, unknown>;
