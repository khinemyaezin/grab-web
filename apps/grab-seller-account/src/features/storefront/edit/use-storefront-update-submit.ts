import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontFormValues, StorefrontLifecycleEvent } from "@/features/storefront/types";
import { useUpdateStorefrontMutation } from "@/features/storefront/api/use-storefronts";
import { buildUpdateStorefrontProfileRequest } from "@/features/storefront/lib/update-storefront-profile-request";
import { problemDetailMessage } from "@/features/storefront/lib/problem-detail";

export type UseStorefrontUpdateSubmitProps = {
  updateLink?: HateoasLink;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

export function useStorefrontUpdateSubmit({
  updateLink,
  onLifecycleEvent,
}: UseStorefrontUpdateSubmitProps) {
  const { getValues } = useFormContext<StorefrontFormValues>();
  const updateMutation = useUpdateStorefrontMutation();

  const submit = useCallback(async () => {
    if (!updateLink) return;
    const values = getValues();
    const payload = buildUpdateStorefrontProfileRequest(values);
    try {
      await updateMutation.mutateAsync({ link: updateLink, request: payload });
      onLifecycleEvent?.({ type: "updated" });
    } catch (error) {
      onLifecycleEvent?.({
        type: "updateFailed",
        message: problemDetailMessage(error, "Failed to update storefront"),
      });
      throw error;
    }
  }, [getValues, onLifecycleEvent, updateLink, updateMutation]);

  return {
    submit,
    isPending: updateMutation.isPending,
    isSuccess: updateMutation.isSuccess,
  };
}
