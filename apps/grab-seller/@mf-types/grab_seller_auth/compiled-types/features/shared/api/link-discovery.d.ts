import { IdentityLinks } from "@/features/shared/types/identity-model";
import { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
declare const linkDiscoveryService: {
    root: (api: PlatformApiClient, link: HateoasLink) => Promise<IdentityLinks>;
};
export { linkDiscoveryService };
