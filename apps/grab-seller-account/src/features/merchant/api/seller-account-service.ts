import {
  createSellerAccountService as createService,
  type SellerAccountServiceFacade,
} from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";

/**
 * @deprecated Use createSellerAccountService from @khinemyaezin/seller-api directly.
 */
export type { SellerAccountServiceFacade };

/**
 * @deprecated Use createSellerAccountService from @khinemyaezin/seller-api directly.
 */
export function createSellerAccountService(
  api: PlatformApiClient,
  entryLink: HateoasLink,
  merchantId?: string,
): SellerAccountServiceFacade {
  return createService(api, entryLink, merchantId);
}
