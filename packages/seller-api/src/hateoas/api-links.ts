const relation = <T extends string>(value: T): T => value;

export const SellerDiscoveryApiLinks = {
  self: relation("self"),
  catalogRoot: relation("get-catalog-root"),
  identityRoot: relation("get-identity-root"),
  inventoryRoot: relation("get-inventory-root"),
  merchantRoot: relation("get-merchant-root"),
  pricingRoot: relation("get-pricing-root"),
  regionRoot: relation("get-region-root"),
  salesChannelRoot: relation("get-sales-channel-root"),
  workflowsRoot: relation("get-workflows-root"),
} as const;

export const SellerAuthApiLinks = {
  login: relation("login"),
  logout: relation("logout"),
  refresh: relation("refresh"),
  register: relation("register"),
} as const;

export const SellerSessionApiLinks = {
  getProfile: relation("get-profile"),
  listAccessContexts: relation("list-access-contexts"),
  selectContext: relation("select-context"),
} as const;

export const SellerMerchantApiLinks = {
  getMerchant: relation("get-merchant"),
  listMerchants: relation("list-merchants"),
  listMerchantReviewQueue: relation("list-merchant-review-queue"),
  updateMerchantProfile: relation("update-merchant-profile"),
} as const;

export const SellerMerchantApplicationApiLinks = {
  createC2cApplication: relation("create-c2c-application"),
  createFirstPartyRetailerApplication: relation("create-first-party-retailer-application"),
  createMerchantApplication: relation("create-merchant-application"),
  getC2cApplication: relation("get-c2c-application"),
  getFirstPartyRetailerApplication: relation("get-first-party-retailer-application"),
  submitMerchantApplication: relation("submit-merchant-application"),
} as const;

export const SellerMerchantMemberApiLinks = {
  acceptInvitation: relation("accept-merchant-member-invitation"),
  inviteMember: relation("invite-merchant-member"),
  listMembers: relation("list-merchant-members"),
  removeMember: relation("remove-merchant-member"),
  updateRole: relation("update-merchant-member-role"),
} as const;

export const SellerFacilityApiLinks = {
  activateBin: relation("activate-bin"),
  activateLocation: relation("activate-location"),
  activateZone: relation("activate-zone"),
  createLocation: relation("create-location"),
  deactivateBin: relation("deactivate-bin"),
  deactivateLocation: relation("deactivate-location"),
  deactivateZone: relation("deactivate-zone"),
  deleteBin: relation("delete-bin"),
  deleteLocation: relation("delete-location"),
  deleteZone: relation("delete-zone"),
  getBin: relation("get-bin"),
  getLocation: relation("get-location"),
  getZone: relation("get-zone"),
} as const;

export const SellerInventoryApiLinks = {
  createInventoryItem: relation("create-inventory-item"),
  getInventoryItem: relation("get-inventory-item"),
  getLatestMovement: relation("get-inventory-movement-latest"),
} as const;

export const SellerReorderSuggestionApiLinks = {
  listSuggestions: relation("list-reorder-suggestions"),
} as const;

export const SellerCategoryApiLinks = {
  createCategory: relation("create-category"),
  deleteCategory: relation("delete-category"),
  getCategory: relation("get-category"),
  getCategoryTree: relation("get-category-tree"),
  listChildren: relation("list-category-children"),
  searchLeaves: relation("search-category-leaves"),
} as const;

export const SellerProductApiLinks = {
  createProduct: relation("create-product"),
  deleteProduct: relation("delete-product"),
  getProduct: relation("get-product"),
  getProductBySlug: relation("get-product-by-slug"),
  getVariant: relation("get-variant"),
  listProducts: relation("list-products"),
  searchProducts: relation("search-products"),
  updateProduct: relation("update-product"),
  updateProductStatus: relation("update-product-status"),
} as const;

export const SellerVariantOptionApiLinks = {
  searchOptions: relation("search-variant-options"),
  searchTypes: relation("search-variant-types"),
} as const;

export const SellerPricingApiLinks = {
  calculatePrices: relation("calculate-prices"),
  createPriceList: relation("create-price-list"),
  createPricePreference: relation("create-price-preference"),
  createPriceSet: relation("create-price-set"),
  getPriceList: relation("get-price-list"),
  getPricePreference: relation("get-price-preference"),
  getPriceSet: relation("get-price-set"),
  listPriceLists: relation("list-price-lists"),
} as const;

export const SellerSalesChannelApiLinks = {
  createMerchantWebsiteChannel: relation("create-merchant-website-channel"),
  getSalesChannel: relation("get-sales-channel"),
  listSalesChannels: relation("list-sales-channels"),
} as const;

export const SellerPublishableKeyApiLinks = {
  createPublishableKey: relation("create-publishable-key"),
  resolvePublishableKey: relation("resolve-publishable-key"),
  revokePublishableKey: relation("revoke-publishable-key"),
} as const;

export const SellerRegionApiLinks = {
  getRegion: relation("get-region"),
  listRegionCountries: relation("list-region-countries"),
} as const;

export const SellerStorefrontApiLinks = {
  activateStorefront: relation("activate-storefront"),
  closeStorefront: relation("close-storefront"),
  createStorefront: relation("create-storefront"),
  getStorefront: relation("get-storefront"),
  listStorefronts: relation("list-storefronts"),
  updateStorefront: relation("update-storefront"),
} as const;

export const SellerWorkflowApiLinks = {
  createSellableProduct: relation("create-sellable-product"),
  getCreateSellableProduct: relation("get-create-sellable-product"),
  getUpdateProductVariant: relation("get-update-product-variant"),
  getUpdateSellableProduct: relation("get-update-sellable-product"),
  getWorkflowStatus: relation("get-workflow-status"),
  listRecentWorkflows: relation("list-recent-workflows"),
  updateProductVariant: relation("update-product-variant"),
  updateSellableProduct: relation("update-sellable-product"),
} as const;

export const SellerAllocationApiLinks = {
  allocateStock: relation("allocate-stock"),
  deallocateStock: relation("deallocate-stock"),
} as const;

export const PendingSellerApiLinks = {
  activateInventoryItem: relation("activate-inventory-item"),
  adjustInventoryItem: relation("adjust-inventory-item"),
  announceInTransit: relation("announce-in-transit"),
  batchVariantImages: relation("batch-variant-images"),
  bin: relation("bin"),
  checkInventoryItemsExistence: relation("check-inventory-items-existence"),
  createBin: relation("create-bin"),
  createProductMediaUpload: relation("create-product-media-upload"),
  createStagedMediaUpload: relation("create-staged-media-upload"),
  createZone: relation("create-zone"),
  damageInventoryItem: relation("damage-inventory-item"),
  deleteVariant: relation("delete-variant"),
  discontinueInventoryItem: relation("discontinue-inventory-item"),
  editBin: relation("edit-bin"),
  editLocation: relation("edit-location"),
  editZone: relation("edit-zone"),
  eventStream: relation("event-stream"),
  generateVariationMatrix: relation("generate-variation-matrix"),
  inventorySummary: relation("inventory-summary"),
  linkLocationToChannel: relation("link-location-to-channel"),
  listInventoryItemMovements: relation("list-inventory-item-movements"),
  listInventoryItemReservations: relation("list-inventory-item-reservations"),
  listVariantPriceLinks: relation("list-variant-price-links"),
  pagedBin: relation("paged-bin"),
  publishProduct: relation("publish-product"),
  reactivateStorefront: relation("reactivate-storefront"),
  receiveInTransit: relation("receive-in-transit"),
  receiveInventoryItem: relation("receive-inventory-item"),
  replaceProductDescriptions: relation("replace-product-descriptions"),
  replaceProductMedia: relation("replace-product-media"),
  restoreProduct: relation("restore-product"),
  restoreVariant: relation("restore-variant"),
  returnInventoryItemToVendor: relation("return-inventory-item-to-vendor"),
  searchBins: relation("search-bins"),
  searchInventoryItems: relation("search-inventory-items"),
  searchLocations: relation("search-locations"),
  searchProductVariants: relation("search-product-variants"),
  searchZones: relation("search-zones"),
  suspendInventoryItem: relation("suspend-inventory-item"),
  suspendProduct: relation("suspend-product"),
  suspendStorefront: relation("suspend-storefront"),
  transferInventoryItem: relation("transfer-inventory-item"),
  unlinkLocationFromChannel: relation("unlink-location-from-channel"),
  updateReorderConfig: relation("update-reorder-config"),
  writeOffInventoryItem: relation("write-off-inventory-item"),
  zone: relation("zone"),
} as const;

export const SellerApiLinks = {
  discovery: SellerDiscoveryApiLinks,
  auth: SellerAuthApiLinks,
  session: SellerSessionApiLinks,
  merchant: SellerMerchantApiLinks,
  merchantApplication: SellerMerchantApplicationApiLinks,
  merchantMember: SellerMerchantMemberApiLinks,
  facility: SellerFacilityApiLinks,
  inventory: SellerInventoryApiLinks,
  reorderSuggestion: SellerReorderSuggestionApiLinks,
  category: SellerCategoryApiLinks,
  product: SellerProductApiLinks,
  variantOption: SellerVariantOptionApiLinks,
  pricing: SellerPricingApiLinks,
  salesChannel: SellerSalesChannelApiLinks,
  publishableKey: SellerPublishableKeyApiLinks,
  region: SellerRegionApiLinks,
  storefront: SellerStorefrontApiLinks,
  workflow: SellerWorkflowApiLinks,
  allocation: SellerAllocationApiLinks,
  pending: PendingSellerApiLinks,
} as const;

type RelationValues<T> = T[keyof T];

export type SellerCanonicalRelation =
  | RelationValues<typeof SellerDiscoveryApiLinks>
  | RelationValues<typeof SellerAuthApiLinks>
  | RelationValues<typeof SellerSessionApiLinks>
  | RelationValues<typeof SellerMerchantApiLinks>
  | RelationValues<typeof SellerMerchantApplicationApiLinks>
  | RelationValues<typeof SellerMerchantMemberApiLinks>
  | RelationValues<typeof SellerFacilityApiLinks>
  | RelationValues<typeof SellerInventoryApiLinks>
  | RelationValues<typeof SellerReorderSuggestionApiLinks>
  | RelationValues<typeof SellerCategoryApiLinks>
  | RelationValues<typeof SellerProductApiLinks>
  | RelationValues<typeof SellerVariantOptionApiLinks>
  | RelationValues<typeof SellerPricingApiLinks>
  | RelationValues<typeof SellerSalesChannelApiLinks>
  | RelationValues<typeof SellerPublishableKeyApiLinks>
  | RelationValues<typeof SellerRegionApiLinks>
  | RelationValues<typeof SellerStorefrontApiLinks>
  | RelationValues<typeof SellerWorkflowApiLinks>
  | RelationValues<typeof SellerAllocationApiLinks>;

export type PendingSellerRelation = RelationValues<typeof PendingSellerApiLinks>;
export type SellerRelation = SellerCanonicalRelation | PendingSellerRelation;
