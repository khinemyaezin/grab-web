import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { BinsFilterForm, CreateBinRequest, UpdateBinRequest } from "@/features/inventory/types";
import type { BinResponse, ListBinResponse } from "@/features/inventory/types/inventory.response";
export declare const binService: {
    searchBins: (api: PlatformApiClient, link: HateoasLink, filters?: BinsFilterForm & Pageable, headers?: Record<string, string>) => Promise<ListBinResponse>;
    getBin: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
    createBin: (api: PlatformApiClient, link: HateoasLink, request: CreateBinRequest, headers?: Record<string, string>) => Promise<BinResponse>;
    updateBin: (api: PlatformApiClient, link: HateoasLink, request: UpdateBinRequest, headers?: Record<string, string>) => Promise<BinResponse>;
    activate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
    deactivate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
    removeBin: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
};
