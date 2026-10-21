import { ProductLifecycleEvent } from "../types";
type UseProductNameWatchProps = {
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export default function useProductNameWatch({ onLifecycleEvent, }: UseProductNameWatchProps): void;
export {};
