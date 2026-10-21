import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
export type AccountBasicFormProps = {
    link: HateoasLink;
    onSuccess?: (response: HalLinks) => void;
};
export default function AccountBasicForm({ link, onSuccess }: AccountBasicFormProps): import("react").JSX.Element;
