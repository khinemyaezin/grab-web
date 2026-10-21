import type { HateoasLink, ZoneLifecycleEvent } from "@/types";
export type ZoneEditFormProps = {
    link: HateoasLink;
    id: string;
    onLifecycleEvent?: (event: ZoneLifecycleEvent) => void;
};
export default function ZoneEditForm({ link, id, onLifecycleEvent }: ZoneEditFormProps): import("react").JSX.Element;
