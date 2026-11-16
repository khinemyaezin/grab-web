import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { AdjustStockRequest, CheckInventoryExistenceRequest, CheckInventoryExistenceResponse, CreateInventoryRequest, InventoryItemResponse, InventoryItemsResponse, ItemsFilterForm, MarkDamagedRequest, ReceiveStockRequest, ReturnToVendorRequest, StockMovementsResponse, TransferInventoryRequest, TransferInventoryResponse, WriteOffStockRequest, InventoryReservationsResponse, AnnounceInTransitRequest, ReceiveInTransitRequest, UpdateReorderConfigRequest, ReorderSuggestionsResponse, InventorySummaryResponse } from "@/features/inventory/types";
export declare const itemService: {
    createItem: (api: PlatformApiClient, link: HateoasLink, request: CreateInventoryRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    getItem: (api: PlatformApiClient, link: HateoasLink, itemId?: string, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    searchItems: (api: PlatformApiClient, link: HateoasLink, filters?: ItemsFilterForm & Pageable) => Promise<InventoryItemsResponse>;
    checkExistence: (api: PlatformApiClient, link: HateoasLink, request: CheckInventoryExistenceRequest, headers?: Record<string, string>) => Promise<CheckInventoryExistenceResponse>;
    receiveStock: (api: PlatformApiClient, link: HateoasLink, request: ReceiveStockRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    adjustStock: (api: PlatformApiClient, link: HateoasLink, request: AdjustStockRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    markDamaged: (api: PlatformApiClient, link: HateoasLink, request: MarkDamagedRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    writeOff: (api: PlatformApiClient, link: HateoasLink, request: WriteOffStockRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    returnToVendor: (api: PlatformApiClient, link: HateoasLink, request: ReturnToVendorRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    suspend: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    activate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    discontinue: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    transfer: (api: PlatformApiClient, link: HateoasLink, request: TransferInventoryRequest, headers?: Record<string, string>) => Promise<TransferInventoryResponse>;
    getMovements: (api: PlatformApiClient, link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) => Promise<StockMovementsResponse>;
    getReservations: (api: PlatformApiClient, link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) => Promise<InventoryReservationsResponse>;
    announceInTransit: (api: PlatformApiClient, link: HateoasLink, request: AnnounceInTransitRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    receiveInTransit: (api: PlatformApiClient, link: HateoasLink, request: ReceiveInTransitRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    updateReorderConfig: (api: PlatformApiClient, link: HateoasLink, request: UpdateReorderConfigRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    getReorderSuggestions: (api: PlatformApiClient, link: HateoasLink, params?: {
        locationId?: string;
        sku?: string;
    }, headers?: Record<string, string>) => Promise<ReorderSuggestionsResponse>;
    getSummary: (api: PlatformApiClient, link: HateoasLink, locationId?: string, headers?: Record<string, string>) => Promise<InventorySummaryResponse>;
};
