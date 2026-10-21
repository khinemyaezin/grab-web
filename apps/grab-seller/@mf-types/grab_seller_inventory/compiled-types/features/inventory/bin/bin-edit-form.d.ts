import type { HateoasLink, BinLifecycleEvent } from "@/types";
export type BinEditFormProps = {
    link: HateoasLink;
    id: string;
    onLifecycleEvent?: (event: BinLifecycleEvent) => void;
};
export default function BinEditForm({ link, id, onLifecycleEvent }: BinEditFormProps): import("react").JSX.Element;
