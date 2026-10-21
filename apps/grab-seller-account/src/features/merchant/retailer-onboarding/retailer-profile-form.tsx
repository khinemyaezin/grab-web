import { FormProvider, useForm } from "react-hook-form";
import { RetailerProfileFormValues } from "@/features/merchant/types";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { UpdateRetailerRegistrationRequest } from "@/features/merchant/types";
import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
import { useUpdateAccount } from "@/features/merchant/api/use-account";
import { UpdateSellerAccountResponse } from "@/features/merchant/types";
import AccountProfileFieldSet from "@/features/merchant/ui/account-profile-fieldset";
import AccountBusinessRegistrationFieldSet from "./account-business-registration-fieldset";
import { FieldGroup } from "@khinemyaezin/seller-ui/components/field";
import { ButtonStatus } from "@khinemyaezin/seller-ui/components/index";

export type RetailerProfileFormProps = {
    link?: HateoasLink,
    onSuccess?: (links: HalLinks) => void,
}

export default function RetailerProfileForm({ link, onSuccess }: RetailerProfileFormProps) {
    const form = useForm<RetailerProfileFormValues>();
    const { handleSubmit } = form;
    const updateAccount = useUpdateAccount();

    function handleOnSubmit(value: RetailerProfileFormValues) {
        if (!link) return;
        const payload: UpdateRetailerRegistrationRequest = {
            legalName: value.legalName,
            displayName: value.displayName,
            contactEmail: value.contactEmail,
            contactPhone: value.contactPhone,
            registrationCountryCode: value.countryCode,
            registrationNumber: value.registrationNumber
        }
        updateAccount.mutate(
            { link, request: payload },
            {
                onSuccess: (response: UpdateSellerAccountResponse) => {
                    if (onSuccess) {
                        onSuccess(response._links)
                    }
                }
            },
        );
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <FieldGroup>
                    <AccountProfileFieldSet />
                    <AccountBusinessRegistrationFieldSet />
                </FieldGroup>
                <Button
                    type="submit"
                    variant="default"
                    size="default"
                    className="mt-6 w-full"
                    disabled={updateAccount.isPending}
                >
                    <ButtonStatus
                        status={
                            updateAccount.isPending
                                ? "pending"
                                : updateAccount.isSuccess
                                    ? "success"
                                    : "idle"
                        }
                        pendingLabel="Saving…"
                        successLabel="Saved"
                    >
                        Save & Continue
                    </ButtonStatus>
                </Button>
            </form>
        </FormProvider>
    );
}
