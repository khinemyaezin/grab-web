import { LocationLifecycleEvent } from "@/types";
export type LocationNewFormProps = {
    onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
};
export default function LocationNewForm({ onLifecycleEvent }: LocationNewFormProps): import("react").JSX.Element | null;
