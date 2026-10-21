import type { HateoasLink } from "@khinemyaezin/seller-api";
export type RoutesProps = {
    link?: HateoasLink;
    platform?: any;
};
export default function AppRoutes({ link, platform }: RoutesProps): import("react").JSX.Element;
