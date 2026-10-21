export type CatalogVariantPickerProps = {
    locationId?: string;
    selectedVariantId?: string;
    onSelect: (variant: CatalogVariantPickerEvent) => void;
};
export type CatalogVariantPickerEvent = {
    product: {
        id: string;
        sku: string;
        name: string;
    };
    inventory?: {
        id: string;
    };
};
export default function CatalogVariantPicker({ locationId, selectedVariantId, onSelect, }: CatalogVariantPickerProps): import("react").JSX.Element;
