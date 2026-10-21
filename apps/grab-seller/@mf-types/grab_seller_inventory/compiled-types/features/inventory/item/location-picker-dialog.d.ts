import type { LocationResponse } from "@/features/inventory/types";
export type LocationPickerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    locations: LocationResponse[];
    selectedIds: string[];
    onApply: (selectedIds: string[]) => void;
};
export declare function LocationPickerDialog({ open, onOpenChange, locations, selectedIds, onApply, }: LocationPickerDialogProps): import("react").JSX.Element;
