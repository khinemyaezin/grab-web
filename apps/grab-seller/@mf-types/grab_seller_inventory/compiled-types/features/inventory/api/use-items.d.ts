import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { AdjustStockRequest, CheckInventoryExistenceResponse, CreateInventoryRequest, InventoryItemResponse, InventoryItemsResponse, ItemsFilterForm, MarkDamagedRequest, ReceiveStockRequest, ReturnToVendorRequest, StockMovementsResponse, TransferInventoryRequest, TransferInventoryResponse, WriteOffStockRequest, InventoryReservationsResponse, AnnounceInTransitRequest, ReceiveInTransitRequest, UpdateReorderConfigRequest, ReorderSuggestionsResponse, InventorySummaryResponse } from "@/features/inventory/types";
export declare function useItems(searchLink?: HateoasLink, filters?: ItemsFilterForm & Pageable): import("@tanstack/react-query").UseQueryResult<InventoryItemsResponse, Error>;
export declare function useInventoryExistence(locationId?: string, skus?: string[]): import("@tanstack/react-query").UseQueryResult<CheckInventoryExistenceResponse, Error>;
export declare function useItem(link?: HateoasLink, itemId?: string): import("@tanstack/react-query").UseQueryResult<InventoryItemResponse, Error>;
export declare function useItemMovements(link?: HateoasLink, pageable?: Pageable): import("@tanstack/react-query").UseQueryResult<StockMovementsResponse, Error>;
export declare function useItemReservations(link?: HateoasLink, pageable?: Pageable): import("@tanstack/react-query").UseQueryResult<InventoryReservationsResponse, Error>;
export declare function useCreateItemMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: CreateInventoryRequest;
}, unknown>;
export declare function useReceiveStockMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: ReceiveStockRequest;
}, unknown>;
export declare function useAdjustStockMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: AdjustStockRequest;
}, unknown>;
export declare function useMarkDamagedMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: MarkDamagedRequest;
}, unknown>;
export declare function useWriteOffMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: WriteOffStockRequest;
}, unknown>;
export declare function useReturnToVendorMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: ReturnToVendorRequest;
}, unknown>;
export declare function useSuspendInventoryMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
}, unknown>;
export declare function useActivateInventoryMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
}, unknown>;
export declare function useDiscontinueInventoryMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
}, unknown>;
export declare function useTransferInventoryMutation(): import("@tanstack/react-query").UseMutationResult<TransferInventoryResponse, Error, {
    link: HateoasLink;
    request: TransferInventoryRequest;
}, unknown>;
export declare function useAnnounceInTransitMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: AnnounceInTransitRequest;
}, unknown>;
export declare function useReceiveInTransitMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: ReceiveInTransitRequest;
}, unknown>;
export declare function useUpdateReorderConfigMutation(): import("@tanstack/react-query").UseMutationResult<InventoryItemResponse, Error, {
    link: HateoasLink;
    request: UpdateReorderConfigRequest;
}, unknown>;
export declare function useReorderSuggestions(link?: HateoasLink, params?: {
    locationId?: string;
    sku?: string;
}): import("@tanstack/react-query").UseQueryResult<ReorderSuggestionsResponse, Error>;
export declare function useInventorySummary(link?: HateoasLink, locationId?: string): import("@tanstack/react-query").UseQueryResult<InventorySummaryResponse, Error>;
