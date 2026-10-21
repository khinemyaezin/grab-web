import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemReceiveInTransitFormProps = {
    link: HateoasLink;
    maxQuantity: number;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemReceiveInTransitForm({ link, maxQuantity, onLifecycleEvent, }: ItemReceiveInTransitFormProps): import("react").JSX.Element;
