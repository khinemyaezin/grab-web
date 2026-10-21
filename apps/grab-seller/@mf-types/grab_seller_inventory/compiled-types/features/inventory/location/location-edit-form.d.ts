import { LocationLifecycleEvent } from "@/types";
export type LocationEditFormProps = {
    locationId: string;
    onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
};
export default function LocationEditForm({ locationId, onLifecycleEvent }: LocationEditFormProps): import("react").JSX.Element | null;
