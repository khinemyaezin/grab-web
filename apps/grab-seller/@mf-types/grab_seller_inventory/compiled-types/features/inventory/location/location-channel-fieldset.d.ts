import type { LocationResponse } from "@/features/inventory/types";
export declare function salesChannelLabel(type: string): string;
export declare function isSellerFacingChannel(type: string): boolean;
export type LocationChannelFieldSetProps = {
    location?: LocationResponse;
};
export declare function LocationChannelFieldSet({ location }: LocationChannelFieldSetProps): import("react").JSX.Element | null;
