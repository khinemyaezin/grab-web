import type { BinSearchCriteria } from "./use-bin-filter";
export type BinFilterProps = {
    onChange?: (filter: BinSearchCriteria) => void;
};
export default function BinFilter({ onChange }: BinFilterProps): import("react").JSX.Element;
