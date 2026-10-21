import { useRef } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { useContextBar } from "@khinemyaezin/seller-ui";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontFormValues, StorefrontLifecycleEvent } from "@/features/storefront/types";
import { toStorefrontSlug } from "@/features/storefront/lib/to-storefront-slug";
import { StorefrontFieldset } from "../ui/storefront-fieldset";
import { useStorefrontCreateSubmit } from "./use-storefront-create-submit";

export type StorefrontNewFormProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

export const DEFAULT_STOREFRONT_FORM_VALUES: StorefrontFormValues = {
  name: "",
  slug: "",
};

export function StorefrontNewForm(props: StorefrontNewFormProps) {
  const form = useForm<StorefrontFormValues>({
    defaultValues: DEFAULT_STOREFRONT_FORM_VALUES,
    mode: "onSubmit",
  });

  return (
    <FormProvider {...form}>
      <StorefrontNewFormContent {...props} />
    </FormProvider>
  );
}

function StorefrontNewFormContent({ link, onLifecycleEvent }: StorefrontNewFormProps) {
  const { handleSubmit, reset, setValue, formState: { isDirty } } = useFormContext<StorefrontFormValues>();
  const slugManualRef = useRef(false);

  const { submit } = useStorefrontCreateSubmit({
    link,
    onLifecycleEvent: (event) => {
      if (event.type === "created") {
        reset(DEFAULT_STOREFRONT_FORM_VALUES);
      }
      onLifecycleEvent?.(event);
    },
  });

  const handleNameChange = (name: string) => {
    if (slugManualRef.current) return;
    setValue("slug", toStorefrontSlug(name), { shouldDirty: true, shouldValidate: true });
  };

  useContextBar({
    dirty: isDirty,
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
      reset(DEFAULT_STOREFRONT_FORM_VALUES);
    },
    groupId: "storefront-new",
    label: "New Storefront",
  });

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Card>
        <CardContent>
          <StorefrontFieldset
            onNameChange={handleNameChange}
            onSlugEdit={() => { slugManualRef.current = true; }}
          />
        </CardContent>
      </Card>
    </form>
  );
}
