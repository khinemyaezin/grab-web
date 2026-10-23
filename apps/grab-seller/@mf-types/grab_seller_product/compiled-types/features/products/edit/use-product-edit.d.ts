export type UseProductEditProps = {
    productId: string;
};
export declare function useProductEdit({ productId }: UseProductEditProps): {
    isLoading: boolean;
    isError: boolean;
    seed: import("../types").ProductFormValue | null;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "SUSPENDED" | undefined;
    actions: Record<string, import("@khinemyaezin/seller-api").HateoasLink> | undefined;
};
