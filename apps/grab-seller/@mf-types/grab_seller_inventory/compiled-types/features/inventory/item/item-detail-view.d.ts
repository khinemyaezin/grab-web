import type { ItemLifecycleEvent } from "@/features/inventory/types";
export type ItemDetailViewProps = {
    itemId: string;
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemDetailView({ itemId, onLifecycleEvent }: ItemDetailViewProps): import("react").JSX.Element;
