import { type ReactNode } from "react";
import type { InventoryCreateContext, InventoryPayload, SlotWidgetProps } from "@khinemyaezin/seller-contracts";
import type { LocationResponse } from "@/features/inventory/types";
export type InventoryLocationsContextValue = {
    locations: LocationResponse[];
    locationById: Map<string, LocationResponse>;
};
export declare function useInventoryCreateLocations(): InventoryLocationsContextValue;
export type InventoryCreateFormContextProps = SlotWidgetProps<InventoryCreateContext, InventoryPayload> & {
    loadingFallback?: ReactNode;
    children: ReactNode;
};
export declare function InventoryCreateFormContext({ context, initialValue, onChange, registerHandle, loadingFallback, children, }: InventoryCreateFormContextProps): string | number | bigint | boolean | import("react").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>;
