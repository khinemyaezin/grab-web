import { HateoasLink } from "@khinemyaezin/seller-api";
export type AccountOnboardingViewProps = {
    listRegionCountriesLink?: HateoasLink;
    createApplicationLink?: HateoasLink;
    getApplicationLink?: HateoasLink;
    onSuccess?: () => void;
};
export default function RetailerAccountOnboardingView({ createApplicationLink, getApplicationLink, listRegionCountriesLink, onSuccess }: AccountOnboardingViewProps): import("react").JSX.Element;
