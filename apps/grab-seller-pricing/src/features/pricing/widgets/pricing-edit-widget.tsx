import { PRODUCT_EXTENSION_SLOTS } from "@khinemyaezin/seller-contracts";
import { createExposedSlot } from "@khinemyaezin/seller-ui";
import { PricingEditSlot } from "./pricing-edit-slot";

export default createExposedSlot({
  defaultSlotId: PRODUCT_EXTENSION_SLOTS.EDIT_PRICING,
  Widget: PricingEditSlot,
});
