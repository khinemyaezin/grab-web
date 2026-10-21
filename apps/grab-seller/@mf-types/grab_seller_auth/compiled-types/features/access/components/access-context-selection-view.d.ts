import { HateoasLink } from "@khinemyaezin/seller-api";
export type AccessContextSelectionViewProps = {
    link: HateoasLink;
    onSuccess?: (assignemntId: string) => void;
};
export default function AccessContextSelectionView({ link, onSuccess }: AccessContextSelectionViewProps): import("react").JSX.Element;
