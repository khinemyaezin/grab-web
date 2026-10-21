import { api, HateoasLink } from "@khinemyaezin/seller-api";
import { SellerAccount, MerchantRoot, SellerAccountResponse } from "@/features/merchant/types";
import { fetchMerchantRoot } from "./discovery";

export interface SellerAccountServiceFacade {
    getAccount: () => Promise<SellerAccount>;
}

export function createSellerAccountService(entryLink: HateoasLink): SellerAccountServiceFacade {
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
        if (!root.getCurrentMerchant) {
            throw new Error("Identity root does not expose a 'get-current-merchant' link");
        }
        return api.followLink<SellerAccountResponse>(root.getCurrentMerchant, "GET");
    };

    return {
        getAccount,
    };
}
