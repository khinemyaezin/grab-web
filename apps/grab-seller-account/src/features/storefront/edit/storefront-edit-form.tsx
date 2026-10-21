import { useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { useContextBar } from "@khinemyaezin/seller-ui";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  StorefrontFormValues,
  StorefrontLifecycleEvent,
  StorefrontResponse,
} from "@/features/storefront/types";
import { toStorefrontFormValue } from "@/features/storefront/lib/to-storefront-form-value";
import { StorefrontFieldset } from "../ui/storefront-fieldset";
import { useStorefrontUpdateSubmit } from "./use-storefront-update-submit";

export type StorefrontEditFormProps = {
  seed: StorefrontResponse;
  updateLink?: HateoasLink;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

export function StorefrontEditForm(props: StorefrontEditFormProps) {
  const form = useForm<StorefrontFormValues>({
    defaultValues: toStorefrontFormValue(props.seed),
    mode: "onSubmit",
  });

  return (
    <FormProvider {...form}>
      <StorefrontEditFormContent {...props} />
    </FormProvider>
  );
}

function StorefrontEditFormContent({
  seed,
  updateLink,
  onLifecycleEvent,
}: StorefrontEditFormProps) {
  const { handleSubmit, reset, formState: { isDirty } } = useFormContext<StorefrontFormValues>();
  const readOnly = !updateLink;

  const { submit } = useStorefrontUpdateSubmit({
    updateLink,
    onLifecycleEvent,
  });

  useEffect(() => {
    reset(toStorefrontFormValue(seed));
  }, [seed.storefrontId, seed.name, seed.slug, seed.updatedAt, reset]);

  useContextBar({
    dirty: !readOnly && isDirty,
    onSave: async () => {
      let valid = false;
      await handleSubmit(
        async () => {
          valid = true;
          await submit();
        },
        () => {
          valid = false;
        },
      )();
      if (!valid) {
        throw new Error("Form validation failed");
      }
    },
    onDiscard: () => {
      reset(toStorefrontFormValue(seed));
    },
    groupId: "storefront-edit",
    label: "Edit Storefront",
  });

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Card>
        <CardContent>
          <StorefrontFieldset disabled={readOnly} salesChannelId={seed.salesChannelId} />
        </CardContent>
      </Card>
    </form>
  );
}
