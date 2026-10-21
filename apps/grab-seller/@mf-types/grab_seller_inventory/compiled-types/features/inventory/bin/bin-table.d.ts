import type { HateoasLink, BinLifecycleEvent } from "@/types";
import type { BinFilterFormValue } from "./use-bin-filter";
type BinTableProps = {
    locationId: string;
    zoneId: string;
    link: HateoasLink;
    filter: BinFilterFormValue;
    onPageChange?: (page: number) => void;
    onLifecycleEvent?: (event: BinLifecycleEvent) => void;
};
export declare function BinTable({ zoneId, link, filter, onPageChange, onLifecycleEvent }: BinTableProps): import("react").JSX.Element;
export {};
