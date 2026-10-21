import { useIdentityGet } from "@/features/shared/hook/use-identity";
import AccessContextSelectionView from "../components/access-context-selection-view";
import { Header, usePlatform } from "@khinemyaezin/seller-ui";

export default function AccessContextSelectionPage() {
    const { data } = useIdentityGet();
    const platform = usePlatform();

    if (!data?.listAccessContext) {
        return null;
    }
    return (
        <main className="grid min-h-svh grid-cols-1">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md space-y-8">
                        <Header
                            title="Select a workspace"
                            description="Choose the workspace you want to manage."
                        >
                        </Header>
                        <AccessContextSelectionView
                            link={data?.listAccessContext}
                            onSuccess={(assignmentId) => {
                                platform?.events.emit("auth:context-selected:v1", { assignmentId })
                            }} />
                    </div>
                </div>
            </div>
        </main>
    )
}