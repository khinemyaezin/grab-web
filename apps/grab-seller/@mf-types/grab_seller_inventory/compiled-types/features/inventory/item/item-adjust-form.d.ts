import type { HateoasLink } from "@khinemyaezin/seller-api";
import { type ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemAdjustFormProps = {
    link: HateoasLink;
    currentOnHand: number;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemAdjustForm({ link, currentOnHand, onLifecycleEvent, }: ItemAdjustFormProps): import("react").JSX.Element;
