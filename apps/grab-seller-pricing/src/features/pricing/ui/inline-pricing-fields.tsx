import { useFormContext } from "react-hook-form";
import { Field, FieldError } from "@khinemyaezin/seller-ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@khinemyaezin/seller-ui/components/input-group";

const DEFAULT_CURRENCY = "USD";

type PricingFieldValues = {
  sku: string;
  currencyCode: string;
  amount: number;
};

export function InlinePricingFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PricingFieldValues>();
  const currencyCode = watch("currencyCode") || DEFAULT_CURRENCY;

  return (
    <>
      <input type="hidden" {...register("sku")} />
      <input type="hidden" {...register("currencyCode")} />
      <Field data-invalid={!!errors.amount}>
        <InputGroup>
          <InputGroupInput
            id="inline-pricing-amount"
            type="number"
            min={0}
            step="any"
            aria-label="Price amount"
            {...register("amount", { valueAsNumber: true })}
          />
          <InputGroupAddon align="inline-end">{currencyCode}</InputGroupAddon>
        </InputGroup>
        {errors.amount ? <FieldError errors={[errors.amount]} /> : null}
      </Field>
    </>
  );
}
