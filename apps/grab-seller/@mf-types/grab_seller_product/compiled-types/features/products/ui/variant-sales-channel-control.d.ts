import { type ReactNode } from "react";
export type VariantSalesChannelControlProps = {
    sku?: string;
    skus?: string[];
    disabled?: boolean;
    description?: string;
    trigger?: (count: number) => ReactNode;
};
export declare function VariantSalesChannelControl({ sku, skus, disabled, description, trigger, }: VariantSalesChannelControlProps): import("react").JSX.Element | null;
