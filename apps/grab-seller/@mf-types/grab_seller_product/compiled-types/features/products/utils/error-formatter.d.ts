import type { ExtensionFieldErrors, SlotValidationErrors } from "@khinemyaezin/seller-contracts";
export interface FormattedErrorToast {
    message: string;
    description?: string;
}
export declare function formatExtensionErrorsForToast(errors?: SlotValidationErrors | ExtensionFieldErrors, fallbackMessage?: string): FormattedErrorToast;
