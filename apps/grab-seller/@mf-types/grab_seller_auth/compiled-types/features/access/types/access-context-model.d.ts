import { HateoasLink } from "@khinemyaezin/seller-api";
export type AccessContext = {
    assignmentId: string;
    scopeKey: string;
    scopeId: string;
    roleCodes: string[];
    display: {
        title: string;
        subtitle: string;
        status: string;
    };
    accessLink?: HateoasLink;
};
