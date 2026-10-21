import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontFormValues, StorefrontLifecycleEvent } from "@/features/storefront/types";
import { useCreateStorefrontMutation } from "@/features/storefront/api/use-storefronts";
import { buildCreateStorefrontRequest } from "@/features/storefront/lib/create-storefront-request";
import { problemDetailMessage } from "@/features/storefront/lib/problem-detail";

export type UseStorefrontCreateSubmitProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

export function useStorefrontCreateSubmit({
  link,
  onLifecycleEvent,
}: UseStorefrontCreateSubmitProps) {
  const { getValues } = useFormContext<StorefrontFormValues>();
  const createMutation = useCreateStorefrontMutation();

  const submit = useCallback(async () => {
    const values = getValues();
    const payload = buildCreateStorefrontRequest(values);
    try {
      const response = await createMutation.mutateAsync({ link, request: payload });
      onLifecycleEvent?.({ type: "created", storefrontId: response.storefrontId });
    } catch (error) {
      onLifecycleEvent?.({
        type: "createFailed",
        message: problemDetailMessage(error, "Failed to create storefront"),
      });
      throw error;
    }
  }, [createMutation, getValues, link, onLifecycleEvent]);

  return {
    submit,
    isPending: createMutation.isPending,
    isSuccess: createMutation.isSuccess,
  };
}
