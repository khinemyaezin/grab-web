import type { HateoasLink } from "../hateoas.js";
import type { AccessContext } from "@khinemyaezin/seller-contracts";

export interface IdentityLinks {
  self?: HateoasLink;
  getProfile?: HateoasLink;
  login?: HateoasLink;
  register?: HateoasLink;
  logout?: HateoasLink;
  csrfToken?: HateoasLink;
  listAccessContext?: HateoasLink;
}

export interface RawIdentityProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  roles?: string[];
  permissions?: string[];
  status?: string;
  accessContexts: AccessContext[];
  currentAccessContext?: AccessContext;
  _links?: Record<string, unknown>;
}
