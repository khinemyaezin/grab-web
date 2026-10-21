import { Header } from "@khinemyaezin/seller-ui";
import MerchantTypeSelectionView from "./merchant-selection-view";
import SellerCentralAnimation from "./seller-central-animation";

export default function MerchantSelectionpage() {
    return (
        <main className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <SellerCentralAnimation />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md space-y-8">
                        <Header
                            title={`Welcome to Seller Central`}
                            description="Let’s get your business started."
                        >
                        </Header>
                        <MerchantTypeSelectionView />
                    </div>
                </div>
            </div>
        </main>

    )
}
