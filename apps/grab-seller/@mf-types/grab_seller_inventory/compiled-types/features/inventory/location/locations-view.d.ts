import { LocationLifecycleEvent } from "@/types";
export type LocationsViewProps = {
    onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
};
export default function LocationsView({ onLifecycleEvent }: LocationsViewProps): import("react").JSX.Element;
