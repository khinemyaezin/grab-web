import type { HateoasLink } from "@khinemyaezin/seller-api";
import { type ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemReceiveFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemReceiveForm({ link, onLifecycleEvent }: ItemReceiveFormProps): import("react").JSX.Element;
