import { HateoasLink } from "@khinemyaezin/seller-api"

export type AccessContext = {
    assignmentId: string,
    title?: string | null,
    accessLink?: HateoasLink
}
