import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
export type RetailerProfileFormProps = {
    link?: HateoasLink;
    onSuccess?: (links: HalLinks) => void;
};
export default function RetailerProfileForm({ link, onSuccess }: RetailerProfileFormProps): import("react").JSX.Element;
