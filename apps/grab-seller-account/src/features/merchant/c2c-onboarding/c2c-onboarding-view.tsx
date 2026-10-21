import { ApiError, HalLinks, HateoasLink, resolveLink } from "@khinemyaezin/seller-api";
import { useEffect, useState, type ReactNode } from "react";
import AccountBasicForm from "@/features/merchant/ui/account-basic-form";
import AccountOnboardingSubmit from "@/features/merchant/ui/account-onboarding-submit";
import OnboardingWizard, {
    type OnboardingWizardStep,
} from "@/features/merchant/ui/onboarding-wizard";
import { useC2CApplicationGet } from "@/features/merchant/api/use-account";
import C2cAccountProfileForm from "./c2c-profile-form";
import AccountOnboardingStatus from "@/features/merchant/ui/account-onboarding-status";
import { Skeleton } from "@khinemyaezin/seller-ui/components/index";

export type AccountOnboardingViewProps = {
    createApplicationLink?: HateoasLink,
    getApplicationLink?: HateoasLink,
    onSuccess?: () => void,
}

type StepId = "account-registration" | "profile-details" | "review";
const DELAY_STEP_MS = 1200;

function LockedStep({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-lg bg-muted/40 px-4 py-5 text-sm text-muted-foreground">
            {children}
        </div>
    );
}

export default function C2cAccountOnboardingView({ createApplicationLink, getApplicationLink, onSuccess }: AccountOnboardingViewProps) {
    const [completeProfileLink, setCompleteProfileLink] = useState<HateoasLink | undefined>(undefined);
    const [submitApplicationLink, setSubmitApplicationLink] = useState<HateoasLink | undefined>(undefined);
    const { data: applicationState, error, refetch } = useC2CApplicationGet(getApplicationLink);
    const [activeStepId, setActiveStepId] = useState<StepId | undefined>(undefined);

    useEffect(() => {
        if (error && error instanceof ApiError && error.status == 404) {
            setActiveStepId("account-registration");
        }

        if (applicationState?.completedContactInfo) {
            handleOnUpdateAccountSuccess(applicationState._links, 0);
        } else if (applicationState?.completedBasicInfo) {
            handleOnAccountRegistrationSuccess(applicationState._links, 0);
        }
    },
        [applicationState, error]);

    function onNextStep(id: StepId, delay: number) {
        const timeout = window.setTimeout(() => {
            setActiveStepId(id);
        }, delay)

        return () => {
            clearTimeout(timeout);
        };
    }

    function handleOnAccountRegistrationSuccess(value: HalLinks, delayStep = DELAY_STEP_MS) {
        const link = resolveLink(value, "edit-merchant-application");
        if (link) setCompleteProfileLink(link);
        onNextStep("profile-details", delayStep)
    }

    function handleOnUpdateAccountSuccess(value: HalLinks, delayStep = DELAY_STEP_MS) {
        const link = resolveLink(value, "submit-merchant-application");
        if (link) setSubmitApplicationLink(link);
        onNextStep("review", delayStep)
    }

    function handleOnSubmitApplicationSuccess() {
        const timeout = window.setTimeout(() => {
            refetch();
        }, DELAY_STEP_MS)

        return () => {
            clearTimeout(timeout);
        };
    }

    const steps: OnboardingWizardStep<StepId>[] = [
        {
            id: "account-registration",
            title: "Account Registration",
            description: "Enter your business details to create an account",
            content: createApplicationLink ? (
                <AccountBasicForm
                    link={createApplicationLink}
                    onSuccess={(links) => handleOnAccountRegistrationSuccess(links, DELAY_STEP_MS)}
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
                <C2cAccountProfileForm
                    link={completeProfileLink}
                    onSuccess={(links) => handleOnUpdateAccountSuccess(links, DELAY_STEP_MS)}
                />
            ) : (
                <LockedStep>Account setup is not available right now.</LockedStep>
            )
        },
        {
            id: "review",
            title: "Submit for Review",
            description: "Confirm that your account is ready to be reviewed.",
            content: submitApplicationLink ? (
                <AccountOnboardingSubmit
                    link={submitApplicationLink}
                    onSuccess={handleOnSubmitApplicationSuccess}
                />
            ) : (
                <LockedStep>Account setup is not available right now.</LockedStep>
            )
        }
    ];

    if (!activeStepId) {
        return <div className="flex w-full max-w-xs flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>;
    }

    if (applicationState?.status && applicationState?.status !== "DRAFT") {
        return <AccountOnboardingStatus accountStatus={applicationState?.status} merchantType={applicationState?.type} />;
    }

    return (
        <OnboardingWizard
            steps={steps}
            activeStepId={activeStepId}
        />
    );
}
