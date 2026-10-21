import { Component, Suspense, lazy, useMemo, useState, type ComponentType, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Alert, AlertDescription, AlertTitle } from "@khinemyaezin/seller-ui/components/alert";

type ErrorBoundaryProps = {
  children: ReactNode;
  onRetry: () => void;
};

class RemoteErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to load federated route", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
          <div className="w-full max-w-sm grid gap-6">
            <Alert variant="destructive" className="max-w-xl">
              <AlertTitle>Module unavailable</AlertTitle>
              <AlertDescription className="mt-3 flex items-center gap-3">
                <span>This area could not be loaded. The rest of the seller portal is still available.</span>
                <Button size="sm" variant="outline" onClick={this.props.onRetry}>Retry</Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RemoteBoundary<P extends object = Record<string, never>>({
  loader,
  label,
  remoteProps,
}: {
  loader: () => Promise<{ default: ComponentType<P> }>;
  label: string;
  remoteProps?: P;
}) {
  const [attempt, setAttempt] = useState(0);
  const Remote = useMemo(() => lazy(() => loader()),
    [attempt, loader]);

  return (
    <RemoteErrorBoundary
      key={attempt}
      onRetry={() => setAttempt((value) => value + 1)}>
      <Suspense fallback={
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
          <div className="w-full max-w-sm grid gap-6">
            <div role="status" className="p-8 text-sm text-muted-foreground">Loading {label}…</div>
          </div>
        </div>
      }>
        <Remote {...(remoteProps as P)} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
