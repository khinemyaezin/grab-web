import { useCallback, useState } from "react";
import { usePlatform } from "@khinemyaezin/seller-ui";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";

export function useStorefrontEditEvents() {
  const platform = usePlatform();
  const [title, setTitle] = useState<string | undefined>();

  const toast = useCallback(
    (type: "success" | "error", message: string) => {
      platform?.events.emit("shell:toast:v1", {
        type,
        message,
        position: "top-center",
      });
    },
    [platform?.events],
  );

  const handleEvent = useCallback(
    (event: StorefrontLifecycleEvent) => {
      switch (event.type) {
        case "titleResolved":
          setTitle(event.title);
          break;
        case "updated":
          toast("success", event.message ?? "Storefront updated");
          break;
        case "updateFailed":
          toast("error", event.message ?? "Failed to update storefront");
          break;
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
    },
    [toast],
  );

  return { title, handleEvent };
}
