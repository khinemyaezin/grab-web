import { FieldGroup, Field, FieldLabel, FieldError } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { useFormContext } from "react-hook-form";
import { AccountProfileFormValues } from "@/features/merchant/types";

export default function AccountProfileFieldSet() {
    const { register, formState: { errors } } = useFormContext<AccountProfileFormValues>();
    return (
        <FieldGroup>
            <Field data-invalid={!!errors.legalName}>
                <FieldLabel htmlFor="legalName">Legal Name</FieldLabel>
                <Input
                    id="legalName"
                    {...register("legalName", { required: "Legal Name is required" })}
                    required
                    aria-invalid={Boolean(errors.legalName)}
                />
                <FieldError errors={[errors.legalName]} />
            </Field>

            <Field data-invalid={!!errors.displayName}>
                <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                <Input
                    id="displayName"
                    {...register("displayName", { required: "Display Name is required" })}
                    required
                    aria-invalid={Boolean(errors.displayName)}
                />
                <FieldError errors={[errors.displayName]} />
            </Field>

            <Field data-invalid={!!errors.contactEmail}>
                <FieldLabel htmlFor="contactEmail">Contact Email</FieldLabel>
                <Input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail", { required: "Contact Email is required" })}
                    required
                    aria-invalid={Boolean(errors.contactEmail)}
                />
                <FieldError errors={[errors.contactEmail]} />
            </Field>

            <Field data-invalid={!!errors.contactPhone}>
                <FieldLabel htmlFor="contactPhone">Contact Phone</FieldLabel>
                <Input
                    id="contactPhone"
                    {...register("contactPhone", { required: "Contact Phone is required" })}
                    required
                    aria-invalid={Boolean(errors.contactPhone)}
                />
                <FieldError errors={[errors.contactPhone]} />
            </Field>
        </FieldGroup>

    )
}