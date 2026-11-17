import { useEffect, useMemo, useRef, useState } from "react";
import {
  ApiError,
  type HalLinks,
  type HateoasLink,
  resolveLink,
  SellerApiLinks,
} from "@khinemyaezin/seller-api";
import { usePlatform } from "@khinemyaezin/seller-ui";
import {
  useC2CApplicationGet,
  useRetailerApplicationGet,
} from "@/features/merchant/api/use-account";
import type {
  C2CApplicationStatusResponse,
  RetailerApplicationStatusResponse,
} from "@/features/merchant/types";

export type OnboardingStepId = "account-registration" | "profile-details" | "review";

export type ApplicationState = C2CApplicationStatusResponse | RetailerApplicationStatusResponse;

export type UseOnboardingFlowOptions = {
  createApplicationLink?: HateoasLink;
  getApplicationLink?: HateoasLink;
  onSuccess?: () => void;
  variant: "c2c" | "retailer";
};

export function useOnboardingFlow({
  getApplicationLink,
  onSuccess,
  variant,
}: UseOnboardingFlowOptions) {
  const platform = usePlatform();

  const c2cQuery = useC2CApplicationGet(variant === "c2c" ? getApplicationLink : undefined);
  const retailerQuery = useRetailerApplicationGet(
    variant === "retailer" ? getApplicationLink : undefined,
  );

  const query = variant === "c2c" ? c2cQuery : retailerQuery;
  const { data: applicationState, error, refetch, isLoading } = query;

  const [overrideStepId, setOverrideStepId] = useState<OnboardingStepId | undefined>(undefined);
  const [completeProfileLink, setCompleteProfileLink] = useState<HateoasLink | undefined>(
    undefined,
  );
  const [submitApplicationLink, setSubmitApplicationLink] = useState<HateoasLink | undefined>(
    undefined,
  );

  // Reset local state when getApplicationLink changes
  const prevGetLinkRef = useRef(getApplicationLink?.href);
  useEffect(() => {
    if (prevGetLinkRef.current !== getApplicationLink?.href) {
      prevGetLinkRef.current = getApplicationLink?.href;
      setOverrideStepId(undefined);
      setCompleteProfileLink(undefined);
      setSubmitApplicationLink(undefined);
    }
  }, [getApplicationLink?.href]);

  // Derive step from server state
  const derivedStepId: OnboardingStepId = useMemo(() => {
    if (
      error &&
      ((error instanceof ApiError && error.status === 404) || (error as any)?.status === 404)
    ) {
      return "account-registration";
    }
    if (applicationState?.completedContactInfo) {
      return "review";
    }
    if (applicationState?.completedBasicInfo) {
      return "profile-details";
    }
    return "account-registration";
  }, [applicationState?.completedBasicInfo, applicationState?.completedContactInfo, error]);

  const activeStepId = overrideStepId ?? derivedStepId;

  // Resolve links from applicationState when available
  const resolvedProfileLink = useMemo(() => {
    if (completeProfileLink) return completeProfileLink;
    if (applicationState?._links) {
      return resolveLink(applicationState._links, SellerApiLinks.merchant.updateMerchantProfile);
    }
    return undefined;
  }, [applicationState?._links, completeProfileLink]);

  const resolvedSubmitLink = useMemo(() => {
    if (submitApplicationLink) return submitApplicationLink;
    if (applicationState?._links) {
      return resolveLink(
        applicationState._links,
        SellerApiLinks.merchantApplication.submitMerchantApplication,
      );
    }
    return undefined;
  }, [applicationState?._links, submitApplicationLink]);

  function onBasicInfoSuccess(links: HalLinks) {
    const link = resolveLink(links, SellerApiLinks.merchant.updateMerchantProfile);
    if (link) {
      setCompleteProfileLink(link);
    }
    setOverrideStepId("profile-details");
  }

  function onProfileSuccess(links: HalLinks) {
    const link = resolveLink(links, SellerApiLinks.merchantApplication.submitMerchantApplication);
    if (link) {
      setSubmitApplicationLink(link);
    }
    setOverrideStepId("review");
  }

  async function onSubmitSuccess() {
    await refetch();
    if (platform) {
      try {
        await platform.session.refresh();
      } catch {
        // Best effort
      }
      platform.events.emit("seller-merchant:registration-success:v1", {});
    }
    onSuccess?.();
  }

  return {
    activeStepId: isLoading && !overrideStepId ? undefined : activeStepId,
    applicationState,
    completeProfileLink: resolvedProfileLink,
    submitApplicationLink: resolvedSubmitLink,
    onBasicInfoSuccess,
    onProfileSuccess,
    onSubmitSuccess,
    refetch,
    isLoading,
  };
}
