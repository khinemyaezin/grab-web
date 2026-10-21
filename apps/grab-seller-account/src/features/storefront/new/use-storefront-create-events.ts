import { useCallback } from "react";
import { useNavigate } from "react-router";
import { usePlatform } from "@khinemyaezin/seller-ui";
import type { StorefrontLifecycleEvent } from "@/features/storefront/types";

export function useStorefrontCreateEvents() {
  const platform = usePlatform();
  const navigate = useNavigate();

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
        case "created":
          toast("success", event.message ?? "Storefront created");
          navigate("..");
          break;
        case "createFailed":
          toast("error", event.message ?? "Failed to create storefront");
          break;
      }
    },
    [navigate, toast],
  );

  return { handleEvent, toast };
}
