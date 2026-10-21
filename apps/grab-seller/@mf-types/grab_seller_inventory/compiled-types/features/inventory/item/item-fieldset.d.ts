type ItemStepFieldSetProps = {
    onSelected?: () => void;
};
export declare function ItemLocationFieldSet({ onSelected }?: ItemStepFieldSetProps): import("react").JSX.Element;
export declare function ItemProductVariantFieldSet({ onSelected }: {
    onSelected: (inventoryId?: string) => void;
}): import("react").JSX.Element;
export declare function ItemStockSettingsFieldSet(): import("react").JSX.Element;
export {};
