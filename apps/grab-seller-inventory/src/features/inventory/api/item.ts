import { resolveUrlTemplate, toPageParams } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type {
  AdjustStockRequest,
  CheckInventoryExistenceRequest,
  CheckInventoryExistenceResponse,
  CreateInventoryRequest,
  InventoryItemResponse,
  InventoryItemsResponse,
  ItemsFilterForm,
  MarkDamagedRequest,
  ReceiveStockRequest,
  ReturnToVendorRequest,
  StockMovementsResponse,
  TransferInventoryRequest,
  TransferInventoryResponse,
  WriteOffStockRequest,
  InventoryReservationsResponse,
  AnnounceInTransitRequest,
  ReceiveInTransitRequest,
  UpdateReorderConfigRequest,
  ReorderSuggestionsResponse,
  InventorySummaryResponse,
} from "@/features/inventory/types";

export const itemService = {
  createItem: (api: PlatformApiClient, link: HateoasLink, request: CreateInventoryRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  getItem: (api: PlatformApiClient, link: HateoasLink, itemId?: string, headers?: Record<string, string>) => {
    const resolved = itemId
      ? resolveUrlTemplate({ inventoryItemId: itemId }, link)
      : link;
    return api.followLink<InventoryItemResponse>(resolved, "GET", undefined, undefined, headers);
  },

  searchItems: (api: PlatformApiClient, link: HateoasLink, filters?: ItemsFilterForm & Pageable) => {
    const { page = 0, size = 20, ...body } = filters ?? {};
    return api.followLink<InventoryItemsResponse>(
      link,
      "POST",
      body,
      toPageParams({ page, size }),
    );
  },

  checkExistence: (api: PlatformApiClient, link: HateoasLink, request: CheckInventoryExistenceRequest, headers?: Record<string, string>) =>
    api.followLink<CheckInventoryExistenceResponse>(link, "POST", request, undefined, headers),

  receiveStock: (api: PlatformApiClient, link: HateoasLink, request: ReceiveStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  adjustStock: (api: PlatformApiClient, link: HateoasLink, request: AdjustStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  markDamaged: (api: PlatformApiClient, link: HateoasLink, request: MarkDamagedRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  writeOff: (api: PlatformApiClient, link: HateoasLink, request: WriteOffStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  returnToVendor: (api: PlatformApiClient, link: HateoasLink, request: ReturnToVendorRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  suspend: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", undefined, undefined, headers),

  activate: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", undefined, undefined, headers),

  discontinue: (api: PlatformApiClient, link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", undefined, undefined, headers),

  transfer: (api: PlatformApiClient, link: HateoasLink, request: TransferInventoryRequest, headers?: Record<string, string>) =>
    api.followLink<TransferInventoryResponse>(link, "POST", request, undefined, headers),

  getMovements: (api: PlatformApiClient, link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) =>
    api.followLink<StockMovementsResponse>(link, "GET", undefined, toPageParams(pageable), headers),

  getReservations: (api: PlatformApiClient, link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) =>
    api.followLink<InventoryReservationsResponse>(link, "GET", undefined, toPageParams(pageable), headers),

  announceInTransit: (api: PlatformApiClient, link: HateoasLink, request: AnnounceInTransitRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  receiveInTransit: (api: PlatformApiClient, link: HateoasLink, request: ReceiveInTransitRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  updateReorderConfig: (api: PlatformApiClient, link: HateoasLink, request: UpdateReorderConfigRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "PUT", request, undefined, headers),

  getReorderSuggestions: (api: PlatformApiClient, link: HateoasLink, params?: { locationId?: string; sku?: string }, headers?: Record<string, string>) =>
    api.followLink<ReorderSuggestionsResponse>(link, "GET", undefined, params, headers),

  getSummary: (api: PlatformApiClient, link: HateoasLink, locationId?: string, headers?: Record<string, string>) => {
    const params = locationId ? { locationId } : undefined;
    return api.followLink<InventorySummaryResponse>(link, "GET", undefined, params, headers);
  },
};
