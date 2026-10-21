import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemLifecycleActionsProps = {
    status: string;
    suspendLink?: HateoasLink;
    activateLink?: HateoasLink;
    discontinueLink?: HateoasLink;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemLifecycleActions({ status, suspendLink, activateLink, discontinueLink, onLifecycleEvent, }: ItemLifecycleActionsProps): import("react").JSX.Element;
