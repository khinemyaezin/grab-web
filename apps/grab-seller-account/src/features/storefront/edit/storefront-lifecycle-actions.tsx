import { useState } from "react";
import { Button, Textarea } from "@khinemyaezin/seller-ui/components/index";
import { Field, FieldError, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@khinemyaezin/seller-ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { Archive, CheckCircle, Ellipsis, Pause, RotateCcw } from "lucide-react";
import { resolveLink, type HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";
import {
  useActivateStorefrontMutation,
  useCloseStorefrontMutation,
  useReactivateStorefrontMutation,
  useSuspendStorefrontMutation,
} from "@/features/storefront/api/use-storefronts";
import { problemDetailMessage } from "@/features/storefront/lib/problem-detail";

export type StorefrontLifecycleActionsProps = {
  links?: Record<string, HateoasLink>;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

type ConfirmKind = "activate" | "reactivate";
type ReasonKind = "suspend" | "close";

export function StorefrontLifecycleActions({
  links,
  onLifecycleEvent,
}: StorefrontLifecycleActionsProps) {
  const activateLink = resolveLink(links, "activate-storefront");
  const suspendLink = resolveLink(links, "suspend-storefront");
  const reactivateLink = resolveLink(links, "reactivate-storefront");
  const closeLink = resolveLink(links, "close-storefront");

  const activateMutation = useActivateStorefrontMutation();
  const reactivateMutation = useReactivateStorefrontMutation();
  const suspendMutation = useSuspendStorefrontMutation();
  const closeMutation = useCloseStorefrontMutation();

  const [confirmKind, setConfirmKind] = useState<ConfirmKind | null>(null);
  const [reasonKind, setReasonKind] = useState<ReasonKind | null>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | undefined>();

  const pending =
    activateMutation.isPending
    || reactivateMutation.isPending
    || suspendMutation.isPending
    || closeMutation.isPending;

  const run = async (
    action: () => Promise<unknown>,
    success: StorefrontLifecycleEvent["type"],
    failure: StorefrontLifecycleEvent["type"],
    fallback: string,
  ) => {
    try {
      await action();
      onLifecycleEvent?.({ type: success } as StorefrontLifecycleEvent);
    } catch (error) {
      onLifecycleEvent?.({
        type: failure,
        message: problemDetailMessage(error, fallback),
      } as StorefrontLifecycleEvent);
    }
  };

  const handleConfirm = () => {
    if (confirmKind === "activate" && activateLink) {
      setConfirmKind(null);
      void run(
        () => activateMutation.mutateAsync(activateLink),
        "activated",
        "activateFailed",
        "Failed to activate storefront",
      );
    }
    if (confirmKind === "reactivate" && reactivateLink) {
      setConfirmKind(null);
      void run(
        () => reactivateMutation.mutateAsync(reactivateLink),
        "reactivated",
        "reactivateFailed",
        "Failed to reactivate storefront",
      );
    }
  };

  const handleReasonConfirm = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setReasonError("Reason is required");
      return;
    }
    if (trimmed.length > 1000) {
      setReasonError("Reason must not exceed 1000 characters");
      return;
    }
    if (reasonKind === "suspend" && suspendLink) {
      setReasonKind(null);
      setReason("");
      void run(
        () => suspendMutation.mutateAsync({ link: suspendLink, request: { reason: trimmed } }),
        "suspended",
        "suspendFailed",
        "Failed to suspend storefront",
      );
    }
    if (reasonKind === "close" && closeLink) {
      setReasonKind(null);
      setReason("");
      void run(
        () => closeMutation.mutateAsync({ link: closeLink, request: { reason: trimmed } }),
        "closed",
        "closeFailed",
        "Failed to close storefront",
      );
    }
  };

  const hasActions = Boolean(
    activateLink
    || suspendLink
    || reactivateLink
    || closeLink,
  );

  if (!hasActions) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="secondary" disabled={pending}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {activateLink && (
              <DropdownMenuItem
                disabled={pending}
                onClick={() => setConfirmKind("activate")}
              >
                <CheckCircle />
                Activate
              </DropdownMenuItem>
            )}
            {reactivateLink && (
              <DropdownMenuItem
                disabled={pending}
                onClick={() => setConfirmKind("reactivate")}
              >
                <RotateCcw />
                Reactivate
              </DropdownMenuItem>
            )}
            {suspendLink && (
              <DropdownMenuItem
                disabled={pending}
                onClick={() => {
                  setReason("");
                  setReasonError(undefined);
                  setReasonKind("suspend");
                }}
              >
                <Pause />
                Suspend
              </DropdownMenuItem>
            )}
            {closeLink && (
              <DropdownMenuItem
                variant="destructive"
                disabled={pending}
                onClick={() => {
                  setReason("");
                  setReasonError(undefined);
                  setReasonKind("close");
                }}
              >
                <Archive />
                Close
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={confirmKind !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmKind(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmKind === "activate" ? "Activate storefront?" : "Reactivate storefront?"}
            </DialogTitle>
            <DialogDescription>
              {confirmKind === "activate"
                ? "This storefront will become active for the merchant."
                : "This storefront will return to active status."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmKind(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              {confirmKind === "activate" ? "Activate" : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={reasonKind !== null}
        onOpenChange={(open) => {
          if (!open) setReasonKind(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reasonKind === "suspend" ? "Suspend storefront?" : "Close storefront?"}
            </DialogTitle>
            <DialogDescription>
              {reasonKind === "suspend"
                ? "Provide a reason. The merchant can still administer this storefront."
                : "Closing is permanent. Provide a reason."}
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={!!reasonError}>
            <FieldLabel htmlFor="lifecycle-reason">Reason</FieldLabel>
            <Textarea
              id="lifecycle-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setReasonError(undefined);
              }}
              maxLength={1000}
            />
            <FieldError errors={reasonError ? [{ message: reasonError }] : []} />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReasonKind(null)}>
              Cancel
            </Button>
            <Button
              variant={reasonKind === "close" ? "destructive" : "default"}
              onClick={handleReasonConfirm}
            >
              {reasonKind === "suspend" ? "Suspend" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
