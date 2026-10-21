import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import UserMenuWidget from "./user-menu-widget";

export default function UserMenuWidgetExposed({ 
    platform, 
    identityLink,
    onLogout,
    trigger
}: { 
    platform: SellerPlatform, 
    identityLink: HateoasLink,
    onLogout: () => void;
    trigger: React.ReactNode;
}) {
    if (!platform || !identityLink) return null;

    return (
        <PlatformProvider platform={platform}>
            <EntryLinkProvider link={identityLink}>
                <UserMenuWidget onLogout={onLogout} trigger={trigger} />
            </EntryLinkProvider>
        </PlatformProvider>
    );
}
