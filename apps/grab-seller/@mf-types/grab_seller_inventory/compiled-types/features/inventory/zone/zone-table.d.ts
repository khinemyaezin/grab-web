import { HateoasLink, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";
import type { ZoneFilterFormValue } from "./use-zone-filter";
type ZoneTableProps = {
    locationId: string;
    link: HateoasLink;
    filter: ZoneFilterFormValue;
    onPageChange?: (page: number) => void;
    onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
};
export declare function ZoneTable({ locationId, link, filter, onPageChange, onLifecycleEvent }: ZoneTableProps): import("react").JSX.Element;
export {};
