import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { BinsFilterForm, CreateBinRequest, UpdateBinRequest } from "@/features/inventory/types";
import type { BinResponse, ListBinResponse } from "@/features/inventory/types/inventory.response";
export declare const binService: {
    searchBins: (link: HateoasLink, filters?: BinsFilterForm & Pageable, headers?: Record<string, string>) => Promise<ListBinResponse>;
    getBin: (link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
    createBin: (link: HateoasLink, request: CreateBinRequest, headers?: Record<string, string>) => Promise<BinResponse>;
    updateBin: (link: HateoasLink, request: UpdateBinRequest, headers?: Record<string, string>) => Promise<BinResponse>;
    activate: (link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
    deactivate: (link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
    removeBin: (link: HateoasLink, headers?: Record<string, string>) => Promise<BinResponse>;
};
