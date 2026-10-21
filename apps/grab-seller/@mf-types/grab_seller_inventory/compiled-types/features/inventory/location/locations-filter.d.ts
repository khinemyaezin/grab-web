import type { LocationSearchCriteria } from "./use-location-filter";
export type LocationsFilterProps = {
    onChange?: (filter: LocationSearchCriteria) => void;
};
export default function LocationsFilter({ onChange }: LocationsFilterProps): import("react").JSX.Element;
