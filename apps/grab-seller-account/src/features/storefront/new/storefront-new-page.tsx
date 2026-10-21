import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform, useShellBreadcrumb } from "@khinemyaezin/seller-ui";
import { QueryState } from "@khinemyaezin/seller-ui/components/query-state";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { useMerchantLink, useRoot } from "@/features/merchant/api/use-root";
import { StorefrontNewForm } from "./storefront-new-form";
import { useStorefrontCreateEvents } from "./use-storefront-create-events";

export default function StorefrontNewPage() {
  const navigate = useNavigate();
  const platform = usePlatform();
  const { isLoading, isError } = useRoot();
  const createStorefrontLink = useMerchantLink("createStorefront");
  const { handleEvent } = useStorefrontCreateEvents();

  useShellBreadcrumb("Add Storefront");

  useEffect(() => {
    if (!platform?.events) return;
    const unsubs = [
      platform.events.subscribe("form:discard:v1", () => {
        navigate("..");
      }),
    ];
    return () => unsubs.forEach((unsub) => unsub());
  }, [navigate, platform?.events]);

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Header
        title="Add Storefront"
        description="Choose a name and unique slug for this merchant’s website channel."
      >
        <ButtonGroup>
          <Button type="button" variant="secondary" asChild>
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </Header>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load merchant capabilities."
      >
        {createStorefrontLink ? (
          <StorefrontNewForm link={createStorefrontLink} onLifecycleEvent={handleEvent} />
        ) : (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Storefront creation is not available.
              </p>
            </CardContent>
          </Card>
        )}
      </QueryState>
    </div>
  );
}
