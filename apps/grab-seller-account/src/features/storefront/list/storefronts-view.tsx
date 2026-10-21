import { Card, CardHeader } from "@khinemyaezin/seller-ui/components/card";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
import { StorefrontTable } from "./storefront-table";

export type StorefrontsViewProps = {
  listLink?: HateoasLink;
  canCreate?: boolean;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

export function StorefrontsView({ listLink, canCreate, onLifecycleEvent }: StorefrontsViewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-end">
        {canCreate && (
          <Button className="self-start sm:self-end" variant="outline" asChild>
            <Link to="new">
              <Plus />
              Add storefront
            </Link>
          </Button>
        )}
      </CardHeader>
      <StorefrontTable link={listLink} onLifecycleEvent={onLifecycleEvent} />
    </Card>
  );
}
