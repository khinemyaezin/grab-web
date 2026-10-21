import { User, AccessContext } from "@khinemyaezin/seller-contracts";
export interface UserProfile extends User {
    accessContexts: AccessContext[];
    currentAccessContext: AccessContext;
}
