import type { ItemSearchCriteria } from "./use-item-filter";
export type ItemsFilterProps = {
    onChange?: (filter: ItemSearchCriteria) => void;
};
export default function ItemsFilter({ onChange }: ItemsFilterProps): import("react").JSX.Element;
