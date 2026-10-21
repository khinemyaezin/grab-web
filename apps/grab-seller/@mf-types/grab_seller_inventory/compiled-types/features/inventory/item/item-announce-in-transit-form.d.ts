import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemAnnounceInTransitFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemAnnounceInTransitForm({ link, onLifecycleEvent, }: ItemAnnounceInTransitFormProps): import("react").JSX.Element;
