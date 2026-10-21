import type { ProductLifecycleEvent } from "../types";
export type ProductEditViewProps = {
    productId: string;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function ProductEditView({ productId, onLifecycleEvent, }: ProductEditViewProps): import("react").JSX.Element;
