import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemWriteOffFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemWriteOffForm({ link, onLifecycleEvent }: ItemWriteOffFormProps): import("react").JSX.Element;
