import { Button } from "@khinemyaezin/seller-ui/components/button";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { toast } from "sonner";
import { useAccountApplicationSubmit } from "@/features/merchant/api/use-account";
import { ButtonStatus } from "@khinemyaezin/seller-ui/components/index";

export type AccountOnboardingSubmitProps = {
    link: HateoasLink,
    onSuccess?: ()=> void
};

export default function AccountOnboardingSubmit({ link, onSuccess }: AccountOnboardingSubmitProps) {
    const submitApplication = useAccountApplicationSubmit();

    async function handleOnSubmit() {
        try {
            await submitApplication.mutateAsync({ link });
            onSuccess?.();
        } catch (error) {
            toast.error("");
        }
    }

    return (
        <div className="space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                    <div>
                        <p className="font-medium">Your application is ready</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Your account registration and profile details are complete.
                            Submit the application for review when you are ready.
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="button"
                className="w-full"
                onClick={handleOnSubmit}
                disabled={submitApplication.isPending || submitApplication.isSuccess}
            >
                <ButtonStatus
                        status={
                            submitApplication.isPending
                                ? "pending"
                                : submitApplication.isSuccess
                                    ? "success"
                                    : "idle"
                        }
                        pendingLabel="Submitting…"
                        successLabel="Submitted"
                    >
                        Submit Application
                    </ButtonStatus>
            </Button>
        </div>
    );
}
