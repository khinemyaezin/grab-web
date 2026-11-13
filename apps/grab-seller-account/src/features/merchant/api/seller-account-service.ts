import { api, HateoasLink, resolveUrlTemplate } from "@khinemyaezin/seller-api";
import { SellerAccount, MerchantRoot, SellerAccountResponse } from "@/features/merchant/types";
import { fetchMerchantRoot } from "./discovery";

export interface SellerAccountServiceFacade {
    getAccount: () => Promise<SellerAccount>;
}

export function createSellerAccountService(entryLink: HateoasLink, merchantId?: string): SellerAccountServiceFacade {
    let discoveryPromise: Promise<MerchantRoot> | null = null;

    const ensureDiscovery = (): Promise<MerchantRoot> => {
        if (!discoveryPromise) {
            discoveryPromise = fetchMerchantRoot(entryLink).catch((error) => {
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
