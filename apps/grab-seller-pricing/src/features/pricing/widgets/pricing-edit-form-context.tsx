import type { ReactNode } from "react";
import type {
  PricingEditContext,
  PricingEditPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { PricingEditForm } from "./pricing-edit-form";
import { usePricingEdit } from "./use-pricing-edit";

export type PricingEditFormContextProps = SlotWidgetProps<
  PricingEditContext,
  PricingEditPayload
> & {
  loadingFallback?: ReactNode;
  children: ReactNode;
};

export function PricingEditFormContext({
  context,
  initialValue,
  onChange,
  registerHandle,
  loadingFallback,
  children,
}: PricingEditFormContextProps) {
  const variantId = context?.variantId?.trim();
  const { seed, isLoading, isError } = usePricingEdit({
    variantId,
    contextSku: context?.sku,
    initialValue,
  });

  if (isError) {
    return <p className="text-sm text-muted-foreground">Failed to load price.</p>;
  }

  if (isLoading) {
    return (
      loadingFallback ?? (
        <p className="text-sm text-muted-foreground">Loading price…</p>
      )
    );
  }

  return (
    <PricingEditForm
      seed={seed}
      contextSku={context?.sku}
      variantId={variantId}
      onValuesChange={onChange}
      registerHandle={registerHandle}
    >
      {children}
    </PricingEditForm>
  );
}
