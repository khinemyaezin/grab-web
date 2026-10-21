import { HalLinks } from "@khinemyaezin/seller-api";

export type EntryRootResponse = {
    _links: HalLinks
}

export type ProfileResponse = {
    id: string;
    email: string;
    roles: string[];
    status: string;
    createdAt: string;
    _links: HalLinks
}

