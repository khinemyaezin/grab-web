import type { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";

export type StorefrontStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "CLOSED";

export type StorefrontLifecycleEvent =
  | { type: "titleResolved"; title: string }
  | { type: "created"; storefrontId?: string; message?: string }
  | { type: "createFailed"; message?: string }
  | { type: "updated"; message?: string }
  | { type: "updateFailed"; message?: string }
  | { type: "activated"; message?: string }
  | { type: "activateFailed"; message?: string }
  | { type: "suspended"; message?: string }
  | { type: "suspendFailed"; message?: string }
  | { type: "reactivated"; message?: string }
  | { type: "reactivateFailed"; message?: string }
  | { type: "closed"; message?: string }
  | { type: "closeFailed"; message?: string };

export type StorefrontFormValues = {
  name: string;
  slug: string;
};

export type CreateStorefrontRequest = {
  name: string;
  slug: string;
};

export type UpdateStorefrontProfileRequest = {
  name: string;
  slug: string;
};

export type StorefrontLifecycleRequest = {
  reason: string;
};

export interface StorefrontResponse {
  storefrontId: string;
  merchantId?: string;
  name: string;
  slug: string;
  status: StorefrontStatus;
  lifecycleReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  salesChannelId?: string | null;
  _links?: HalLinks;
}

export interface StorefrontsResponse {
  storefronts?: StorefrontResponse[];
  _embedded?: {
    storefrontResponseList?: StorefrontResponse[];
    storefrontResponses?: StorefrontResponse[];
  };
  _links?: Record<string, HateoasLink>;
}
