import { FormProvider, useForm } from "react-hook-form";
import { AccountProfileFormValues as AccountDetailFormValues } from "@/features/merchant/types";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { UpdateBasicMerchantProfileRequest } from "@/features/merchant/types";
import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
import { useUpdateAccount } from "@/features/merchant/api/use-account";
import { UpdateSellerAccountResponse } from "@/features/merchant/types";
import AccountProfileFieldSet from "@/features/merchant/ui/account-profile-fieldset";
import { ButtonStatus } from "@khinemyaezin/seller-ui/components/button-status";

export type AccountProfileFormProps = {
    link?: HateoasLink,
    onSuccess?: (links: HalLinks) => void,
}

export default function C2cAccountProfileForm({ link, onSuccess }: AccountProfileFormProps) {
    const form = useForm<AccountDetailFormValues>();
    const { handleSubmit } = form;
    const updateAccount = useUpdateAccount();

    function handleOnSubmit(value: AccountDetailFormValues) {
        if (!link) return;
        const payload: UpdateBasicMerchantProfileRequest = {
            legalName: value.legalName,
            displayName: value.displayName,
            contactEmail: value.contactEmail,
            contactPhone: value.contactPhone,
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
                <AccountProfileFieldSet />

                <Button
                    type="submit"
                    variant="default"
                    size="default"
                    className="mt-6 w-full"
                    disabled={updateAccount.isPending || updateAccount.isSuccess}
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
