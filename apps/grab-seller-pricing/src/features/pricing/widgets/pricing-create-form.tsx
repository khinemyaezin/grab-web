import { useCallback, useEffect, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PricingPayloadSchema,
  type PricingCreateContext,
  type PricingPayload,
  type SlotHandle,
} from "@khinemyaezin/seller-contracts";
import { useSlotChangeEmitter, useRhfSlotHandle, useRhfValueSource } from "@khinemyaezin/seller-ui";
import { projectPricingCreate } from "../lib/project-pricing";

const schema = z.fromJSONSchema(PricingPayloadSchema) as z.ZodType<
  PricingPayload,
  PricingPayload
>;

const DEFAULT_VALUE: PricingPayload = {
  sku: "",
  currencyCode: "USD",
  amount: 0,
};

export type PricingCreateFormProps = {
  context?: PricingCreateContext;
  defaultValues?: PricingPayload;
  onValuesChange?: (values: PricingPayload) => void;
  registerHandle?: (handle: SlotHandle<PricingPayload>) => void | (() => void);
  children: ReactNode;
};

export function PricingCreateForm({
  context,
  defaultValues,
  onValuesChange,
  registerHandle,
  children,
}: PricingCreateFormProps) {
  const form = useForm<PricingPayload>({
    defaultValues: {
      ...(defaultValues ?? DEFAULT_VALUE),
      ...(context?.sku !== undefined ? { sku: context.sku } : {}),
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { setValue, getValues } = form;
  const contextSku = context?.sku;

  useEffect(() => {
    if (contextSku === undefined) return;
    if (getValues("sku") === contextSku) return;
    setValue("sku", contextSku, { shouldDirty: false });
  }, [contextSku, setValue, getValues]);

  const source = useRhfValueSource<PricingPayload>(form);
  useSlotChangeEmitter(source, onValuesChange);

  const getBaseline = useCallback((): PricingPayload => {
    const mounted = form.formState.defaultValues;
    return {
      sku: contextSku ?? mounted?.sku ?? "",
      currencyCode: mounted?.currencyCode ?? "USD",
      amount: mounted?.amount ?? 0,
    };
  }, [contextSku, form.formState.defaultValues]);

  useRhfSlotHandle<PricingPayload>(form, {
    registerHandle,
    getBaseline,
    onChange: onValuesChange,
    project: projectPricingCreate,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
