import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemTransferFormProps = {
    link: HateoasLink;
    fromLocationId: string;
    maxQuantity: number;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemTransferForm({ link, fromLocationId, maxQuantity, onLifecycleEvent, }: ItemTransferFormProps): import("react").JSX.Element;
