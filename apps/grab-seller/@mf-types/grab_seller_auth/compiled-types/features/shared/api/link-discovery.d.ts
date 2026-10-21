import { IdentityLinks } from "@/features/shared/types/identity-model";
import { HateoasLink } from "@khinemyaezin/seller-api";
declare const linkDiscoveryService: {
    root: (link: HateoasLink) => Promise<IdentityLinks>;
};
export { linkDiscoveryService };
