import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type ButtonStatusState = "idle" | "pending" | "success" | "failed"

type ButtonStatusProps = React.ComponentProps<"span"> & {
  status: ButtonStatusState
  pendingLabel?: React.ReactNode
  successLabel?: React.ReactNode
  failedLabel?: React.ReactNode
}

function ButtonStatus({
  status,
  pendingLabel = "Working…",
  successLabel = "Done",
  failedLabel = "Failed",
  children,
  className,
  ...props
}: ButtonStatusProps) {
  return (
    <span
      data-slot="button-status"
      data-status={status}
      aria-live="polite"
      aria-atomic="true"
      aria-busy={status === "pending"}
      className={cn("inline-grid place-items-center", className)}
      {...props}
    >
      <span
        aria-hidden={status !== "idle"}
        className={cn(
          "col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-opacity duration-150 motion-reduce:transition-none",
          status === "idle" ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        {children}
      </span>

      <span
        aria-hidden={status !== "pending"}
        className={cn(
          "col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-opacity duration-150 motion-reduce:transition-none",
          status === "pending"
            ? "visible opacity-100"
            : "invisible opacity-0"
        )}
      >
        <Spinner aria-hidden="true" />
        {pendingLabel}
      </span>

      <span
        aria-hidden={status !== "success"}
        className={cn(
          "col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5",
          status === "success"
            ? "visible animate-in fade-in zoom-in-75 opacity-100 duration-200 motion-reduce:animate-none"
            : "invisible opacity-0"
        )}
      >
        <CheckIcon aria-hidden="true" />
        {successLabel}
      </span>

      <span
        aria-hidden={status !== "failed"}
        className={cn(
          "col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5",
          status === "failed"
            ? "visible animate-in fade-in zoom-in-75 opacity-100 duration-200 motion-reduce:animate-none text-destructive"
            : "invisible opacity-0"
        )}
      >
        <XIcon aria-hidden="true" />
        {failedLabel}
      </span>
    </span>
  )
}

export { ButtonStatus, type ButtonStatusProps, type ButtonStatusState }
