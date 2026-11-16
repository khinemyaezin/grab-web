import type { HateoasLink } from "../hateoas.js";
import { resolveUrlTemplate } from "../hateoas/link-resolver.js";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type {
  MerchantRoot,
  SellerAccount,
  SellerAccountResponse,
  SellerAccountService,
} from "./types.js";
import { fetchMerchantRoot } from "./discovery.js";

export function createSellerAccountService(
  api: PlatformApiClient,
  entryLink: HateoasLink,
  merchantId?: string,
): SellerAccountService {
  let discoveryPromise: Promise<MerchantRoot> | null = null;

  const ensureDiscovery = (): Promise<MerchantRoot> => {
    if (!discoveryPromise) {
      discoveryPromise = fetchMerchantRoot(api, entryLink).catch((error) => {
        discoveryPromise = null;
        throw error;
      });
    }
    return discoveryPromise;
  };

  const getAccount = async (): Promise<SellerAccount> => {
    const root = await ensureDiscovery();
    if (!root.getMerchant) {
      throw new Error("Merchant root does not expose a 'get-merchant' link");
    }
    if (!merchantId || merchantId === "*") {
      throw new Error("A merchant-scoped access context is required to load the current merchant");
    }
    const merchantLink = resolveUrlTemplate({ merchantId }, root.getMerchant);
    return api.followLink<SellerAccountResponse>(merchantLink, "GET");
  };

  return {
    getAccount,
  };
}
