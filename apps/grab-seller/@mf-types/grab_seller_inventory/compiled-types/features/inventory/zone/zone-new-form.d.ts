import { HateoasLink, ZoneLifecycleEvent } from "@/types";
export type ZoneNewFormProps = {
    link: HateoasLink;
    locationId: string;
    onLifecycleEvent?: (event: ZoneLifecycleEvent) => void;
};
export default function ZoneNewForm({ link, onLifecycleEvent }: ZoneNewFormProps): import("react").JSX.Element;
