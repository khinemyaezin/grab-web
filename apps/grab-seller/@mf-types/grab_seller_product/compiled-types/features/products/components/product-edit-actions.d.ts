import { HateoasLink } from "@khinemyaezin/seller-api";
import { ProductLifecycleEvent } from "../types";
export type ProductActionsMenuProps = {
    links?: Record<string, HateoasLink>;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductActionsMenu({ links, onLifecycleEvent }: ProductActionsMenuProps): import("react").JSX.Element | null;
