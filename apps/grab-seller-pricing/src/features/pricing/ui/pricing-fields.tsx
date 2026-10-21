import { useFormContext } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@khinemyaezin/seller-ui/components/field";
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

export function PricingFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PricingFieldValues>();
  const currencyCode = watch("currencyCode") || DEFAULT_CURRENCY;

  return (
    <FieldGroup className="grid gap-4">
      <input type="hidden" {...register("sku")} />
      <input type="hidden" {...register("currencyCode")} />
      <div className="grid gap-3">
        <Field data-invalid={!!errors.amount}>
          <FieldLabel htmlFor="pricing-amount">Amount</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="pricing-amount"
              type="number"
              min={0}
              step="any"
              {...register("amount", { valueAsNumber: true })}
            />
            <InputGroupAddon align="inline-end">{currencyCode}</InputGroupAddon>
          </InputGroup>
          {errors.amount ? <FieldError errors={[errors.amount]} /> : null}
        </Field>
      </div>
    </FieldGroup>
  );
}
