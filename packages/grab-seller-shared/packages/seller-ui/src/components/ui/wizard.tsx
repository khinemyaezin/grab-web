import { Check } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type WizardStep<StepId extends string = string> = {
    id: StepId,
    title: string,
    description: string,
    content: ReactNode,
};

export type WizardProps<StepId extends string> = {
    steps: WizardStep<StepId>[],
    activeStepId: StepId,
    children?: ReactNode,
};

export default function Wizard<StepId extends string>({
    steps,
    activeStepId,
    children,
}: WizardProps<StepId>) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const activeStepIndex = steps.findIndex((step) => step.id === activeStepId);
    const activeStep = steps[activeStepIndex];
    const [ completedSteps, setCompletedSteps ] = useState<Set<StepId>>(new Set<StepId>());

    useEffect(() => {
        setCompletedSteps(new Set(steps.slice(0, activeStepIndex + 1).map(step => step.id)));
    }, [activeStepId, steps, activeStepIndex]);

    useEffect(() => {
        headingRef.current?.focus();
    }, [activeStepId]);

    if (!activeStep) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div aria-label="Onboarding progress" className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                    <span
                        className="font-medium"
                        role="status"
                        aria-live="polite"
                    >
                        Step {activeStepIndex + 1} of {steps.length}
                    </span>
                    <span className="text-muted-foreground">
                        {activeStep.title}
                    </span>
                </div>

                <ol
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
                >
                    {steps.map((step) => {
                        const isComplete = completedSteps.has(step.id);
                        const isActive = step.id === activeStepId;

                        return (
                            <li
                                key={step.id}
                                aria-current={isActive ? "step" : undefined}
                                className="space-y-2"
                            >
                                <div
                                    aria-hidden="true"
                                    className={[
                                        "h-1.5 rounded-full transition-colors duration-300",
                                        isComplete || isActive ? "bg-primary" : "bg-muted",
                                    ].join(" ")}
                                />
                                <span className="sr-only">
                                    {step.title}: {isComplete ? "complete" : isActive ? "current" : "upcoming"}
                                </span>
                            </li>
                        );
                    })}
                </ol>
            </div>

            <section
                key={activeStep.id}
                aria-labelledby={`${activeStep.id}-title`}
                className={[
                    "rounded-xl border bg-card shadow-xs",
                    "animate-in fade-in duration-300 motion-reduce:animate-none",
                    "slide-in-from-right-4",
                ].join(" ")}
            >
                <div className="mb-6 flex items-start gap-3 p-6 pb-0">
                    <div className="min-w-0">
                        <h2
                            ref={headingRef}
                            id={`${activeStep.id}-title`}
                            tabIndex={-1}
                            className="text-xl font-semibold tracking-tight outline-none"
                        >
                            {activeStep.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {activeStep.description}
                        </p>
                    </div>
                </div>

                {activeStep.content}
            </section>

            {children}
        </div>
    );
}