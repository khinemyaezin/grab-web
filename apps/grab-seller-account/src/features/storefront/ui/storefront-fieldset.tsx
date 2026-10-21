import { useFormContext } from "react-hook-form";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@khinemyaezin/seller-ui/components/field";
import type { StorefrontFormValues } from "@/features/storefront/types";
import { STOREFRONT_SLUG_MAX_LENGTH, STOREFRONT_SLUG_PATTERN } from "@/features/storefront/lib/to-storefront-slug";

export type StorefrontFieldsetProps = {
  onNameChange?: (name: string) => void;
  onSlugEdit?: () => void;
  disabled?: boolean;
  salesChannelId?: string | null;
};

export function StorefrontFieldset({ onNameChange, onSlugEdit, disabled, salesChannelId }: StorefrontFieldsetProps) {
  const { register, formState: { errors } } = useFormContext<StorefrontFormValues>();
  const nameRegister = register("name", {
    required: "Name is required",
    maxLength: { value: 255, message: "Name must not exceed 255 characters" },
    onChange: (event) => onNameChange?.(event.target.value),
  });

  return (
    <FieldSet>
      <FieldLegend>Storefront profile</FieldLegend>
      <FieldDescription>
        This storefront brands your website channel. It is not the Grab marketplace. The slug is unique and used in public URLs.
      </FieldDescription>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              disabled={disabled}
              placeholder="Main Shop"
              {...nameRegister}
            />
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={!!errors.slug}>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              aria-invalid={!!errors.slug}
              disabled={disabled}
              placeholder="main-shop"
              {...register("slug", {
                required: "Slug is required",
                maxLength: {
                  value: STOREFRONT_SLUG_MAX_LENGTH,
                  message: `Slug must not exceed ${STOREFRONT_SLUG_MAX_LENGTH} characters`,
                },
                pattern: {
                  value: STOREFRONT_SLUG_PATTERN,
                  message: "Slug must be lowercase kebab-case",
                },
                onChange: () => onSlugEdit?.(),
              })}
            />
            <FieldError errors={[errors.slug]} />
          </Field>
        </div>
        {salesChannelId ? (
          <Field>
            <FieldLabel htmlFor="salesChannelId">Website channel</FieldLabel>
            <Input
              id="salesChannelId"
              value={salesChannelId}
              disabled
              readOnly
            />
            <FieldDescription>Assigned when this merchant was approved. Used by public browse.</FieldDescription>
          </Field>
        ) : null}
      </FieldGroup>
    </FieldSet>
  );
}
