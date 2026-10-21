import { HateoasLink } from "@khinemyaezin/seller-api";
export type AccountOnboardingViewProps = {
    createApplicationLink?: HateoasLink;
    getApplicationLink?: HateoasLink;
    onSuccess?: () => void;
};
export default function C2cAccountOnboardingView({ createApplicationLink, getApplicationLink, onSuccess }: AccountOnboardingViewProps): import("react").JSX.Element;
