import type { InventoryStatusBreakdown } from "@/features/inventory/types";
type InventoryStatusPieChartProps = {
    status: InventoryStatusBreakdown;
    totalItems: number;
};
export default function InventoryStatusPieChart({ status, totalItems, }: InventoryStatusPieChartProps): import("react").JSX.Element;
export {};
