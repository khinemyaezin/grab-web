import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
import { useAccount } from "@/features/merchant/api/use-account";
import { AccountBasicFormValues } from "@/features/merchant/types";
import { ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { CreateAccountRequest } from "@/features/merchant/types";
import { CreateSellerAccountResponse } from "@/features/merchant/types";
import { useRegionCountries } from "@/features/merchant/api/use-region";
import { NativeSelect, NativeSelectOption } from "@khinemyaezin/seller-ui/components/native-select";
import { useMemo } from "react";

export type AccountBasicFormProps = {
    link: HateoasLink,
    countriesLink?: HateoasLink,
    onSuccess?: (response: HalLinks) => void,
}

export default function AccountBasicForm({ link, countriesLink, onSuccess }: AccountBasicFormProps) {
    const form = useForm<AccountBasicFormValues>();
    const { handleSubmit, register, formState: { errors } } = form;
    const submitAccount = useAccount();
    const countries = useRegionCountries(countriesLink);
    const countryOptions = useMemo(() => {
        const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
        return (countries.data ?? [])
            .map((countryCode) => ({
                countryCode,
                name: displayNames.of(countryCode) ?? countryCode,
            }))
            .sort((left, right) => left.name.localeCompare(right.name));
    }, [countries.data]);

    function handleOnSubmit(value: AccountBasicFormValues) {
        const payload: CreateAccountRequest = {
            displayName: value.displayName,
            primaryMarketCountryCode: value.primaryMarketCountryCode,
        }
        submitAccount.mutate(
            { link, request: payload },
            {
                onSuccess: (response: CreateSellerAccountResponse) => {
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
                    <Field data-invalid={!!errors.displayName}>
                        <FieldLabel htmlFor="displayName">Name</FieldLabel>
                        <Input
                            id="displayName"
                            {...register("displayName", { required: "Display Name is required" })}
                            required
                            aria-invalid={Boolean(errors.displayName)}
                        />
                        <FieldError errors={[errors.displayName]} />
                    </Field>
                    <Field data-invalid={!!errors.primaryMarketCountryCode}>
                        <FieldLabel htmlFor="primaryMarketCountryCode">Primary market</FieldLabel>
                        <NativeSelect
                            id="primaryMarketCountryCode"
                            {...register("primaryMarketCountryCode", { required: "Primary market is required" })}
                            disabled={countries.isLoading || countries.isError || countries.data?.length === 0}
                            aria-invalid={Boolean(errors.primaryMarketCountryCode)}
                            defaultValue=""
                        >
                            <NativeSelectOption value="">
                                {countries.isLoading ? "Loading markets…" : countries.data?.length ? "Select a country" : "No markets available"}
                            </NativeSelectOption>
                            {countryOptions.map(({ countryCode, name }) => (
                                <NativeSelectOption key={countryCode} value={countryCode}>
                                    {name}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                        {countries.isError && (
                            <button type="button" className="text-sm underline" onClick={() => void countries.refetch()}>
                                Retry loading markets
                            </button>
                        )}
                        <FieldError errors={[errors.primaryMarketCountryCode]} />
                    </Field>
                </FieldGroup>

                <Button
                    type="submit"
                    variant="default"
                    size="default"
                    className="mt-6 w-full"
                    disabled={submitAccount.isPending || submitAccount.isSuccess || countries.isLoading || countries.isError || !countries.data?.length}
                >
                    <ButtonStatus
                        status={
                            submitAccount.isPending
                                ? "pending"
                                : submitAccount.isSuccess
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
