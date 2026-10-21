import { HateoasLink } from "@khinemyaezin/seller-api";
export type AccountOnboardingSubmitProps = {
    link: HateoasLink;
    onSuccess?: () => void;
};
export default function AccountOnboardingSubmit({ link, onSuccess }: AccountOnboardingSubmitProps): import("react").JSX.Element;
