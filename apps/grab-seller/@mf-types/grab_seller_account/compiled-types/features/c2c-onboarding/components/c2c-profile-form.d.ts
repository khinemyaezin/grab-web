import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
export type AccountProfileFormProps = {
    link?: HateoasLink;
    onSuccess?: (links: HalLinks) => void;
};
export default function C2cAccountProfileForm({ link, onSuccess }: AccountProfileFormProps): import("react").JSX.Element;
