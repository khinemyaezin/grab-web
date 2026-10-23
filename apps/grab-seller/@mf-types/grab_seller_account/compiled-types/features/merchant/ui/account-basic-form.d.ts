import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
export type AccountBasicFormProps = {
    link: HateoasLink;
    countriesLink?: HateoasLink;
    onSuccess?: (response: HalLinks) => void;
};
export default function AccountBasicForm({ link, countriesLink, onSuccess }: AccountBasicFormProps): import("react").JSX.Element;
