import { HateoasLink, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";
export type ZonesViewProps = {
    locationId: string;
    link: HateoasLink;
    canCreate: boolean;
    onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
};
export default function ZonesView({ locationId, link, canCreate, onLifecycleEvent }: ZonesViewProps): import("react").JSX.Element;
