import { type ReactNode } from "react";
export type OnboardingWizardStep<StepId extends string = string> = {
    id: StepId;
    title: string;
    description: string;
    content: ReactNode;
};
export type OnboardingWizardProps<StepId extends string> = {
    steps: OnboardingWizardStep<StepId>[];
    activeStepId: StepId;
    onBack?: () => void;
};
export default function OnboardingWizard<StepId extends string>({ steps, activeStepId, onBack, }: OnboardingWizardProps<StepId>): import("react").JSX.Element | null;
