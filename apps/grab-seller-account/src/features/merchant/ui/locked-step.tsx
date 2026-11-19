import type { ReactNode } from "react";

export function LockedStep({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/40 px-4 py-5 text-sm text-muted-foreground">{children}</div>
  );
}

export default LockedStep;
