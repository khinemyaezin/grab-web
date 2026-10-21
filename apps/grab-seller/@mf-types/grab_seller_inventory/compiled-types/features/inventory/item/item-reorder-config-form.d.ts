import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemReorderConfigFormProps = {
    link: HateoasLink;
    safetyStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    maxStock: number | null;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemReorderConfigForm({ link, safetyStock, reorderPoint, reorderQuantity, maxStock, onLifecycleEvent, }: ItemReorderConfigFormProps): import("react").JSX.Element;
