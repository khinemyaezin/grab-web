import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform, useShellBreadcrumb } from "@khinemyaezin/seller-ui";
import { QueryState } from "@khinemyaezin/seller-ui/components/query-state";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { useMerchantLink, useRoot } from "@/features/merchant/api/use-root";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
import { StorefrontsView } from "./storefronts-view";

export default function StorefrontListPage() {
  const platform = usePlatform();
  const { isLoading, isError } = useRoot();
  const listStorefrontsLink = useMerchantLink("listStorefronts");
  const createStorefrontLink = useMerchantLink("createStorefront");

  useShellBreadcrumb("Storefronts");

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: StorefrontLifecycleEvent) => {
    switch (event.type) {
      case "activated":
        toast("success", event.message ?? "Storefront activated");
        break;
      case "activateFailed":
        toast("error", event.message ?? "Failed to activate storefront");
        break;
      case "suspended":
        toast("success", event.message ?? "Storefront suspended");
        break;
      case "suspendFailed":
        toast("error", event.message ?? "Failed to suspend storefront");
        break;
      case "reactivated":
        toast("success", event.message ?? "Storefront reactivated");
        break;
      case "reactivateFailed":
        toast("error", event.message ?? "Failed to reactivate storefront");
        break;
      case "closed":
        toast("success", event.message ?? "Storefront closed");
        break;
      case "closeFailed":
        toast("error", event.message ?? "Failed to close storefront");
        break;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Storefronts"
        description="Create and manage the brand for this merchant’s website channel."
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load merchant capabilities."
      >
        {listStorefrontsLink ? (
          <StorefrontsView
            listLink={listStorefrontsLink}
            canCreate={!!createStorefrontLink}
            onLifecycleEvent={handleEvent}
          />
        ) : (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Storefront management is not available for this account.
              </p>
            </CardContent>
          </Card>
        )}
      </QueryState>
    </div>
  );
}
