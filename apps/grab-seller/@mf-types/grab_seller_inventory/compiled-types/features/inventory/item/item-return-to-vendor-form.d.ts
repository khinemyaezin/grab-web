import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemReturnToVendorFormProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemReturnToVendorForm({ link, onLifecycleEvent }: ItemReturnToVendorFormProps): import("react").JSX.Element;
