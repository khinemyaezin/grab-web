import type { HateoasLink } from "@khinemyaezin/seller-api";
import AccountBasicForm from "@/features/merchant/ui/account-basic-form";
import AccountOnboardingSubmit from "@/features/merchant/ui/account-onboarding-submit";
import OnboardingWizard, {
  type OnboardingWizardStep,
} from "@/features/merchant/ui/onboarding-wizard";
import C2cAccountProfileForm from "./c2c-profile-form";
import AccountOnboardingStatus from "@/features/merchant/ui/account-onboarding-status";
import { Skeleton } from "@khinemyaezin/seller-ui/components/index";
import { useRoot } from "@/features/merchant/api/use-root";
import {
  useOnboardingFlow,
  type OnboardingStepId,
} from "@/features/merchant/onboarding/use-onboarding-flow";
import { LockedStep } from "@/features/merchant/ui/locked-step";

export type AccountOnboardingViewProps = {
  createApplicationLink?: HateoasLink;
  getApplicationLink?: HateoasLink;
  onSuccess?: () => void;
};

export default function C2cAccountOnboardingView({
  createApplicationLink,
  getApplicationLink,
  onSuccess,
}: AccountOnboardingViewProps) {
  const root = useRoot().data;
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
    variant: "c2c",
  });

  const steps: OnboardingWizardStep<OnboardingStepId>[] = [
    {
      id: "account-registration",
      title: "Account Registration",
      description: "Enter your business details to create an account",
      content: createApplicationLink ? (
        <AccountBasicForm
          link={createApplicationLink}
          countriesLink={root?.listRegionCountries}
          onSuccess={onBasicInfoSuccess}
        />
      ) : (
        <LockedStep>Account setup is not available right now.</LockedStep>
      ),
    },
    {
      id: "profile-details",
      title: "Profile details",
      description: "Add the contact information customers can use to reach you.",
      content: completeProfileLink ? (
        <C2cAccountProfileForm link={completeProfileLink} onSuccess={onProfileSuccess} />
      ) : (
        <LockedStep>Account setup is not available right now.</LockedStep>
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
