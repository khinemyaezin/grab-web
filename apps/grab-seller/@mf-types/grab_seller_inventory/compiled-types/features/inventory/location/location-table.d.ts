import { LocationLifecycleEvent } from "@/types";
import type { LocationFilterFormValue } from "./use-location-filter";
export type LocationTableProps = {
    filter: LocationFilterFormValue;
    onPageChange?: (page: number) => void;
    onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
};
export default function LocationTable({ filter, onPageChange, onLifecycleEvent }: LocationTableProps): import("react").JSX.Element;
