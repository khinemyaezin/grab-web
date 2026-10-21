import type {
  PricingEditContext,
  PricingEditPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { InlinePricingFields } from "@/features/pricing/ui/inline-pricing-fields";
import { PricingFields } from "@/features/pricing/ui/pricing-fields";
import { PricingEditFormContext } from "./pricing-edit-form-context";

export function PricingEditSlot(
  props: SlotWidgetProps<PricingEditContext, PricingEditPayload>,
) {
  const Fields = props.variant === "inline" ? InlinePricingFields : PricingFields;
  return (
    <PricingEditFormContext {...props}>
      <Fields />
    </PricingEditFormContext>
  );
}
