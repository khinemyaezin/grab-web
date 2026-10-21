import type {
  PricingCreateContext,
  PricingPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { InlinePricingFields } from "@/features/pricing/ui/inline-pricing-fields";
import { PricingFields } from "@/features/pricing/ui/pricing-fields";
import { PricingCreateForm } from "./pricing-create-form";

export function PricingCreateSlot(
  props: SlotWidgetProps<PricingCreateContext, PricingPayload>,
) {
  const Fields = props.variant === "inline" ? InlinePricingFields : PricingFields;
  return (
    <PricingCreateForm
      context={props.context}
      defaultValues={props.initialValue}
      onValuesChange={props.onChange}
      registerHandle={props.registerHandle}
    >
      <Fields />
    </PricingCreateForm>
  );
}
