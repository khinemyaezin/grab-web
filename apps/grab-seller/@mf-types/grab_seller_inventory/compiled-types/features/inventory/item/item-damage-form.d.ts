import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemDamageFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemDamageForm({ link, onLifecycleEvent }: ItemDamageFormProps): import("react").JSX.Element;
