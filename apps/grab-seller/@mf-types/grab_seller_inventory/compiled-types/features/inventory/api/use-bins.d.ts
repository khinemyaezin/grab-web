import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { BinsFilterForm, CreateBinRequest, UpdateBinRequest } from "@/features/inventory/types";
import type { BinResponse, ListBinResponse } from "@/features/inventory/types/inventory.response";
export declare function useBins(link?: HateoasLink, zoneId?: string, filter?: BinsFilterForm & Pageable): import("@tanstack/react-query").UseQueryResult<ListBinResponse, Error>;
export declare function useBin(link?: HateoasLink, id?: string): import("@tanstack/react-query").UseQueryResult<BinResponse, Error>;
export declare function useCreateBinMutation(): import("@tanstack/react-query").UseMutationResult<BinResponse, Error, {
    link: HateoasLink;
    request: CreateBinRequest;
}, unknown>;
export declare function useUpdateBinMutation(): import("@tanstack/react-query").UseMutationResult<BinResponse, Error, {
    link: HateoasLink;
    request: UpdateBinRequest;
}, unknown>;
export declare function useActivateBinMutation(): import("@tanstack/react-query").UseMutationResult<BinResponse, Error, HateoasLink, unknown>;
export declare function useDeactivateBinMutation(): import("@tanstack/react-query").UseMutationResult<BinResponse, Error, HateoasLink, unknown>;
export declare function useDeleteBinMutation(): import("@tanstack/react-query").UseMutationResult<BinResponse, Error, HateoasLink, unknown>;
