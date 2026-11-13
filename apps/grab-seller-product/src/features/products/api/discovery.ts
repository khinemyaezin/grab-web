import { api, resolveLink, SellerApiLinks, type HalLinks, type HateoasLink } from "@khinemyaezin/seller-api";
import type { CatalogRoot } from "@/features/products/types";

type RootResponse = { _links: HalLinks };

export async function fetchCatalogRoot(link: HateoasLink): Promise<CatalogRoot> {
  const response = await api.followLink<RootResponse>(link);
  return {
    self: resolveLink(response._links, SellerApiLinks.discovery.self),
    searchProducts: resolveLink(response._links, SellerApiLinks.product.searchProducts),
    getProduct: resolveLink(response._links, SellerApiLinks.product.getProduct),
    getVariant: resolveLink(response._links, SellerApiLinks.product.getVariant),
    createProduct: resolveLink(response._links, SellerApiLinks.product.createProduct),
    createProductMediaUpload: resolveLink(response._links, SellerApiLinks.pending.createProductMediaUpload),
    createStagedMediaUpload: resolveLink(response._links, SellerApiLinks.pending.createStagedMediaUpload),
    replaceProductMedia: resolveLink(response._links, SellerApiLinks.pending.replaceProductMedia),
    replaceProductDescriptions: resolveLink(response._links, SellerApiLinks.pending.replaceProductDescriptions),
    searchCategoryLeaves: resolveLink(response._links, SellerApiLinks.category.searchLeaves),
    searchVariantTypes: resolveLink(response._links, SellerApiLinks.variantOption.searchTypes),
    searchVariantOptions: resolveLink(response._links, SellerApiLinks.variantOption.searchOptions),
    generateVariationMatrix: resolveLink(response._links, SellerApiLinks.pending.generateVariationMatrix),
    createSellableProduct: resolveLink(response._links, SellerApiLinks.workflow.createSellableProduct),
    updateSellableProduct: resolveLink(response._links, SellerApiLinks.workflow.updateSellableProduct),
    updateProductVariant: resolveLink(response._links, SellerApiLinks.workflow.updateProductVariant),
    batchVariantImages: resolveLink(response._links, SellerApiLinks.pending.batchVariantImages),
  };
}
