import type { InventoryHealthBreakdown } from "@/features/inventory/types";
type StockHealthPieChartProps = {
    health: InventoryHealthBreakdown;
};
export default function StockHealthPieChart({ health }: StockHealthPieChartProps): import("react").JSX.Element;
export {};
