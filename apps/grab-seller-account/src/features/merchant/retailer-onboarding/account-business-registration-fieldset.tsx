import { Field, FieldError, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { useFormContext } from "react-hook-form";
import { AccountBusinessRegistrationFormValues } from "@/features/merchant/types";

export default function AccountBusinessRegistrationFieldSet() {
    const { register, formState: { errors } } = useFormContext<AccountBusinessRegistrationFormValues>();
    return (
        <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!errors.registrationNumber}>
                    <FieldLabel htmlFor="registrationNumber">Registration Number</FieldLabel>
                    <Input
                        id="registrationNumber"
                        {...register("registrationNumber", { required: "Registration Number is required" })}
                        required
                        aria-invalid={Boolean(errors.registrationNumber)}
                    />
                    <FieldError errors={[errors.registrationNumber]} />
                </Field>
                <Field data-invalid={!!errors.countryCode}>
                    <FieldLabel htmlFor="countryCode">Country Code</FieldLabel>
                    <Input
                        id="countryCode"
                        {...register("countryCode", { required: "Country Code is required" })}
                        required
                        aria-invalid={Boolean(errors.countryCode)}
                    />
                    <FieldError errors={[errors.countryCode]} />
                </Field>
            </div>
        </FieldGroup>
    )
}