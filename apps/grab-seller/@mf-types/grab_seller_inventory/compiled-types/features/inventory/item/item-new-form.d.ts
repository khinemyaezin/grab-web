import { ItemLifecycleEvent } from "@/types";
export type ItemNewFormProps = {
    onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};
export default function ItemNewForm({ onLifecycleEvent }: ItemNewFormProps): import("react").JSX.Element | null;
