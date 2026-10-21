import { useCallback, useEffect, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PricingEditPayloadSchema,
  type PricingEditPayload,
  type SlotHandle,
} from "@khinemyaezin/seller-contracts";
import { useSlotChangeEmitter, useRhfSlotHandle, useRhfValueSource } from "@khinemyaezin/seller-ui";
import { projectPricingEdit } from "../lib/project-pricing";

const editSchema = z.fromJSONSchema(PricingEditPayloadSchema) as z.ZodType<
  PricingEditPayload,
  PricingEditPayload
>;

const DEFAULT_EDIT_VALUE: PricingEditPayload = {
  sku: "",
  currencyCode: "USD",
  amount: 0,
};

export type PricingEditFormProps = {
  seed?: PricingEditPayload;
  contextSku?: string;
  variantId?: string;
  onValuesChange?: (values: PricingEditPayload) => void;
  registerHandle?: (handle: SlotHandle<PricingEditPayload>) => void | (() => void);
  children: ReactNode;
};

export function PricingEditForm({
  seed,
  contextSku,
  variantId,
  onValuesChange,
  registerHandle,
  children,
}: PricingEditFormProps) {
  const form = useForm<PricingEditPayload>({
    defaultValues: {
      ...(seed ?? DEFAULT_EDIT_VALUE),
      ...(contextSku !== undefined ? { sku: contextSku } : {}),
    },
    resolver: zodResolver(editSchema),
    mode: "onChange",
  });

  const { reset, setValue, getValues } = form;

  useEffect(() => {
    reset({
      ...(seed ?? DEFAULT_EDIT_VALUE),
      ...(contextSku !== undefined ? { sku: contextSku } : {}),
    });
  }, [contextSku, reset, seed]);

  useEffect(() => {
    if (contextSku !== undefined && getValues("sku") !== contextSku) {
      setValue("sku", contextSku, { shouldDirty: false });
    }
  }, [contextSku, setValue, getValues]);

  const getBaseline = useCallback((): PricingEditPayload => {
    return seed ?? DEFAULT_EDIT_VALUE;
  }, [seed]);

  useRhfSlotHandle<PricingEditPayload>(form, {
    registerHandle,
    getBaseline,
    onChange: onValuesChange,
    project: (value) => projectPricingEdit(value, variantId),
  });

  const source = useRhfValueSource<PricingEditPayload>(form);
  useSlotChangeEmitter(source, onValuesChange);

  return (
    <FormProvider {...form}>
      <input type="hidden" {...form.register("sku")} />
      <input type="hidden" {...form.register("currencyCode")} />
      <input type="hidden" {...form.register("priceSetId")} />
      <input type="hidden" {...form.register("priceId")} />
      {children}
    </FormProvider>
  );
}
