import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { AdjustStockRequest, CheckInventoryExistenceRequest, CheckInventoryExistenceResponse, CreateInventoryRequest, InventoryItemResponse, InventoryItemsResponse, ItemsFilterForm, MarkDamagedRequest, ReceiveStockRequest, ReturnToVendorRequest, StockMovementsResponse, TransferInventoryRequest, TransferInventoryResponse, WriteOffStockRequest, InventoryReservationsResponse, AnnounceInTransitRequest, ReceiveInTransitRequest, UpdateReorderConfigRequest, ReorderSuggestionsResponse, InventorySummaryResponse } from "@/features/inventory/types";
export declare const itemService: {
    createItem: (link: HateoasLink, request: CreateInventoryRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    getItem: (link: HateoasLink, itemId?: string, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    searchItems: (link: HateoasLink, filters?: ItemsFilterForm & Pageable) => Promise<InventoryItemsResponse>;
    checkExistence: (link: HateoasLink, request: CheckInventoryExistenceRequest, headers?: Record<string, string>) => Promise<CheckInventoryExistenceResponse>;
    receiveStock: (link: HateoasLink, request: ReceiveStockRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    adjustStock: (link: HateoasLink, request: AdjustStockRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    markDamaged: (link: HateoasLink, request: MarkDamagedRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    writeOff: (link: HateoasLink, request: WriteOffStockRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    returnToVendor: (link: HateoasLink, request: ReturnToVendorRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    suspend: (link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    activate: (link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    discontinue: (link: HateoasLink, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    transfer: (link: HateoasLink, request: TransferInventoryRequest, headers?: Record<string, string>) => Promise<TransferInventoryResponse>;
    getMovements: (link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) => Promise<StockMovementsResponse>;
    getReservations: (link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) => Promise<InventoryReservationsResponse>;
    announceInTransit: (link: HateoasLink, request: AnnounceInTransitRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    receiveInTransit: (link: HateoasLink, request: ReceiveInTransitRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    updateReorderConfig: (link: HateoasLink, request: UpdateReorderConfigRequest, headers?: Record<string, string>) => Promise<InventoryItemResponse>;
    getReorderSuggestions: (link: HateoasLink, params?: {
        locationId?: string;
        sku?: string;
    }, headers?: Record<string, string>) => Promise<ReorderSuggestionsResponse>;
    getSummary: (link: HateoasLink, locationId?: string, headers?: Record<string, string>) => Promise<InventorySummaryResponse>;
};
