import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { LocationResponse, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";
export type LocationZonesViewProps = {
    locationId: string;
    location?: LocationResponse;
    searchLink?: HateoasLink;
    canCreate: boolean;
    onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
};
export default function LocationZonesView({ locationId, location, searchLink, canCreate, onLifecycleEvent, }: LocationZonesViewProps): import("react").JSX.Element;
