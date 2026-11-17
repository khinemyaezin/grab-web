import type { HateoasLink } from "@khinemyaezin/seller-api";
import OnboardingWizard, {
  type OnboardingWizardStep,
} from "@/features/merchant/ui/onboarding-wizard";
import AccountOnboardingStatus from "@/features/merchant/ui/account-onboarding-status";
import AccountBasicForm from "@/features/merchant/ui/account-basic-form";
import RetailerProfileForm from "./retailer-profile-form";
import AccountOnboardingSubmit from "@/features/merchant/ui/account-onboarding-submit";
import { Skeleton } from "@khinemyaezin/seller-ui/components/index";
import {
  useOnboardingFlow,
  type OnboardingStepId,
} from "@/features/merchant/onboarding/use-onboarding-flow";
import { LockedStep } from "@/features/merchant/ui/locked-step";

export type AccountOnboardingViewProps = {
  listRegionCountriesLink?: HateoasLink;
  createApplicationLink?: HateoasLink;
  getApplicationLink?: HateoasLink;
  onSuccess?: () => void;
};

export default function RetailerAccountOnboardingView({
  createApplicationLink,
  getApplicationLink,
  listRegionCountriesLink,
  onSuccess,
}: AccountOnboardingViewProps) {
  const {
    activeStepId,
    applicationState,
    completeProfileLink,
    submitApplicationLink,
    onBasicInfoSuccess,
    onProfileSuccess,
    onSubmitSuccess,
  } = useOnboardingFlow({
    createApplicationLink,
    getApplicationLink,
    onSuccess,
    variant: "retailer",
  });

  const steps: OnboardingWizardStep<OnboardingStepId>[] = [
    {
      id: "account-registration",
      title: "Account Registration",
      description: "Enter your business details to create an account",
      content: createApplicationLink ? (
        <AccountBasicForm
          link={createApplicationLink}
          countriesLink={listRegionCountriesLink}
          onSuccess={onBasicInfoSuccess}
        />
      ) : (
        <LockedStep>Account setup is not available right now.</LockedStep>
      ),
    },
    {
      id: "profile-details",
      title: "Complete Your Profile",
      description: "Add additional information to complete your profile",
      content: completeProfileLink ? (
        <RetailerProfileForm link={completeProfileLink} onSuccess={onProfileSuccess} />
      ) : (
        <LockedStep>Profile setup is not available right now.</LockedStep>
      ),
    },
    {
      id: "review",
      title: "Submit for Review",
      description: "Confirm that your account is ready to be reviewed.",
      content: submitApplicationLink ? (
        <AccountOnboardingSubmit link={submitApplicationLink} onSuccess={onSubmitSuccess} />
      ) : (
        <LockedStep>Account setup is not available right now.</LockedStep>
      ),
    },
  ];

  if (!activeStepId) {
    return (
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (applicationState?.status && applicationState.status !== "DRAFT") {
    return (
      <AccountOnboardingStatus
        accountStatus={applicationState.status}
        merchantType={applicationState.type}
      />
    );
  }

  return <OnboardingWizard steps={steps} activeStepId={activeStepId} />;
}
