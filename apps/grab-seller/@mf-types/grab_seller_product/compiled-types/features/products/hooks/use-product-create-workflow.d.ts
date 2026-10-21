import { HateoasLink } from "@khinemyaezin/seller-api";
import { ProductLifecycleEvent } from "../types";
export type UseProductCreateWorkflowProps = {
    link: HateoasLink;
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};
export type SubmitWorkflowReturn = {
    productId: string;
};
export declare function useProductCreateWorkflow({ link, onLifecycleEvent }: UseProductCreateWorkflowProps): {
    submitWorkflow: () => Promise<SubmitWorkflowReturn>;
    reset: () => void;
};
