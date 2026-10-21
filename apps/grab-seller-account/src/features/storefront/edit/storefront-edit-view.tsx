import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { QueryState } from "@khinemyaezin/seller-ui/components/query-state";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { resolveLink } from "@khinemyaezin/seller-api";
import { useMerchantLink } from "@/features/merchant/api/use-root";
import { useStorefront } from "@/features/storefront/api/use-storefronts";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
import { StorefrontEditForm } from "./storefront-edit-form";
import { StorefrontLifecycleActions } from "./storefront-lifecycle-actions";

export type StorefrontEditViewProps = {
  storefrontId: string;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

export function StorefrontEditView({
  storefrontId,
  onLifecycleEvent,
}: StorefrontEditViewProps) {
  const getStorefrontLink = useMerchantLink("getStorefront");
  const { data: storefront, isLoading, isError } = useStorefront(getStorefrontLink, storefrontId);

  const updateLink = resolveLink(storefront?._links, "update-storefront");

  useEffect(() => {
    if (storefront?.name) {
      onLifecycleEvent?.({ type: "titleResolved", title: storefront.name });
    }
  }, [storefront?.name, onLifecycleEvent]);

  return (
    <>
      <Header
        title={storefront?.name ?? "Edit Storefront"}
        description="Update the website channel brand and slug."
      >
        <ButtonGroup>
          <ButtonGroup>
            <Button type="button" variant="secondary" asChild>
              <Link to=".." className="flex gap-2 items-center">
                <ArrowLeftIcon />
              </Link>
            </Button>
          </ButtonGroup>
          {storefront && (
            <ButtonGroup>
              <StorefrontLifecycleActions
                links={storefront._links}
                onLifecycleEvent={onLifecycleEvent}
              />
            </ButtonGroup>
          )}
        </ButtonGroup>
      </Header>
      <QueryState
        isLoading={isLoading || !storefront}
        isError={isError && !storefront}
        errorMessage="Failed to load storefront."
      >
        {storefront ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{storefront.status}</Badge>
              {storefront.lifecycleReason && (
                <p className="text-sm text-muted-foreground">{storefront.lifecycleReason}</p>
              )}
            </div>
            <StorefrontEditForm
              seed={storefront}
              updateLink={updateLink}
              onLifecycleEvent={onLifecycleEvent}
            />
          </div>
        ) : null}
      </QueryState>
    </>
  );
}
