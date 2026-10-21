import { ApiError, HalLinks, HateoasLink, resolveLink } from "@khinemyaezin/seller-api";
import { useEffect, useState, type ReactNode } from "react";
import OnboardingWizard, {
    type OnboardingWizardStep,
} from "@/features/merchant/ui/onboarding-wizard";
import { useRetailerApplicationGet } from "@/features/merchant/api/use-account";
import AccountOnboardingStatus from "@/features/merchant/ui/account-onboarding-status";
import AccountBasicForm from "@/features/merchant/ui/account-basic-form";
import RetailerProfileForm from "./retailer-profile-form";
import AccountOnboardingSubmit from "@/features/merchant/ui/account-onboarding-submit";
import { Skeleton } from "@khinemyaezin/seller-ui/components/index";

export type AccountOnboardingViewProps = {
    createApplicationLink?: HateoasLink,
    getApplicationLink?: HateoasLink,
    onSuccess?: () => void,
}

type StepId = "account-registration" | "profile-registration" | "submit-application";
const DELAY_STEP_MS = 1200;

function LockedStep({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-lg bg-muted/40 px-4 py-5 text-sm text-muted-foreground">
            {children}
        </div>
    );
}

export default function RetailerAccountOnboardingView({ createApplicationLink, getApplicationLink, onSuccess }: AccountOnboardingViewProps) {
    const [completeProfileLink, setCompleteProfileLink] = useState<HateoasLink | undefined>(undefined);
    const [submitApplicationLink, setSubmitApplicationLink] = useState<HateoasLink | undefined>(undefined);
    const { data: applicationState, error, refetch } = useRetailerApplicationGet(getApplicationLink);
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

    }, [applicationState, error]);

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
        onNextStep("profile-registration", delayStep);
    }


    function handleOnUpdateAccountSuccess(value: HalLinks, delayStep = DELAY_STEP_MS) {
        const link = resolveLink(value, "submit-merchant-application");
        if (link) setSubmitApplicationLink(link);
        onNextStep("submit-application", delayStep);
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
            content: createApplicationLink ?
                <AccountBasicForm
                    link={createApplicationLink}
                    onSuccess={(link) => handleOnAccountRegistrationSuccess(link, DELAY_STEP_MS)} />
                : <LockedStep>Account setup is not available right now.</LockedStep>
        },
        {
            id: "profile-registration",
            title: "Complete Your Profile",
            description: "Add additional information to complete your profile",
            content: completeProfileLink ?
                <RetailerProfileForm
                    link={completeProfileLink}
                    onSuccess={(link) => handleOnUpdateAccountSuccess(link, DELAY_STEP_MS)} />
                : <LockedStep>Profile setup is not available right now.</LockedStep>
        },
        {
            id: "submit-application",
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
