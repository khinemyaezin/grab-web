import { HateoasLink } from "@khinemyaezin/seller-api";
export type AccountOnboardingViewProps = {
    createApplicationLink?: HateoasLink;
    getApplicationLink?: HateoasLink;
    onSuccess?: () => void;
};
export default function RetailerAccountOnboardingView({ createApplicationLink, getApplicationLink, onSuccess }: AccountOnboardingViewProps): import("react").JSX.Element;
