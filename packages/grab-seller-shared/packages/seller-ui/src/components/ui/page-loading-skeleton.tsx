import type * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type PageLoadingSkeletonProps = React.ComponentProps<"div"> & {
  rows?: number
  actions?: number
}

function PageLoadingSkeleton({
  className,
  rows = 3,
  actions = 1,
  ...props
}: PageLoadingSkeletonProps) {
  const rowCount = Math.max(0, Math.floor(rows))
  const actionCount = Math.max(0, Math.floor(actions))

  return (
    <div
      role="status"
      aria-label="Loading page"
      data-slot="page-loading-skeleton"
      className={cn(
        "rounded-xl bg-card py-6 text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-7 px-6">
        {Array.from({ length: rowCount }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className={cn("h-4", index % 2 === 0 ? "w-20" : "w-28")} />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
      {actionCount > 0 && (
        <div className="mt-6 flex justify-end gap-2 border-t px-6 pt-6">
          {Array.from({ length: actionCount }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24" />
          ))}
        </div>
      )}
    </div>
  )
}

export { PageLoadingSkeleton }
