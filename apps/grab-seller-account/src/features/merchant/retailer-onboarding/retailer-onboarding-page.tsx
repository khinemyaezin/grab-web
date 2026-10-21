import { Header, usePlatform } from "@khinemyaezin/seller-ui"
import RetailerAnimation from "./retailer-animation";
import RetailerAccountOnboardingView from "./retailer-onboarding-view"
import { useRoot } from "@/features/merchant/api/use-root";

export type RetailerOnboardingPageProps = {

}
export default function RetailerOnboardingPage({ }: RetailerOnboardingPageProps) {
    const { data: root } = useRoot();
    const platform = usePlatform();

    return (
        <main className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <RetailerAnimation />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md space-y-8">
                        <Header
                            title={`Welcome to Seller Central`}
                            description="Let’s get your business started. We’ll guide you through the setup process."
                        >
                        </Header>
                        {root && (
                            <RetailerAccountOnboardingView
                                getApplicationLink={root?.getRetailerApplication}
                                createApplicationLink={root?.createRetailerApplication}
                                onSuccess={() => platform?.events?.emit("seller-merchant:registration-success:v1", {})
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
