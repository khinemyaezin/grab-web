import { useParams } from "react-router";
import { useShellBreadcrumb } from "@khinemyaezin/seller-ui";
import { QueryState } from "@khinemyaezin/seller-ui/components/query-state";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { useMerchantLink, useRoot } from "@/features/merchant/api/use-root";
import { StorefrontEditView } from "./storefront-edit-view";
import { useStorefrontEditEvents } from "./use-storefront-edit-events";

export default function StorefrontEditPage() {
  const { storefrontId } = useParams<{ storefrontId: string }>();
  const { isLoading, isError } = useRoot();
  const getStorefrontLink = useMerchantLink("getStorefront");
  const { title, handleEvent } = useStorefrontEditEvents();
  useShellBreadcrumb(title);

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <QueryState
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load merchant capabilities."
      >
        {getStorefrontLink && storefrontId ? (
          <StorefrontEditView storefrontId={storefrontId} onLifecycleEvent={handleEvent} />
        ) : (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This storefront cannot be opened.
              </p>
            </CardContent>
          </Card>
        )}
      </QueryState>
    </div>
  );
}
