import type { ZoneSearchCriteria } from "./use-zone-filter";
export type ZoneFilterProps = {
    onChange?: (filter: ZoneSearchCriteria) => void;
};
export default function ZoneFilter({ onChange }: ZoneFilterProps): import("react").JSX.Element;
