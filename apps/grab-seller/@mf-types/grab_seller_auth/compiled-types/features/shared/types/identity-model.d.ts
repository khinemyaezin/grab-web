import { HateoasLink } from "@khinemyaezin/seller-api";
export type IdentityLinks = {
    self?: HateoasLink;
    getProfile?: HateoasLink;
    login?: HateoasLink;
    register?: HateoasLink;
    logout?: HateoasLink;
    refreshToken?: HateoasLink;
    listAccessContext?: HateoasLink;
};
