import type { HateoasLink, BinLifecycleEvent } from "@/types";
export type BinNewFormProps = {
    link: HateoasLink;
    zoneId: string;
    onLifecycleEvent?: (event: BinLifecycleEvent) => void;
};
export default function BinNewForm({ link, zoneId, onLifecycleEvent }: BinNewFormProps): import("react").JSX.Element;
