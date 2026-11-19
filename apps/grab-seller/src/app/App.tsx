import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@khinemyaezin/seller-ui";
import type { SellerRuntimeConfig } from "@khinemyaezin/seller-contracts";
import { ShellPlatformProvider } from "./ShellPlatformProvider";
import { EntryLinkProvider } from "./EntryLinkProvider";
import { AuthProvider } from "./AuthProvider";
import { EventStreamProvider } from "./EventStreamProvider";
import { ShellRoutes } from "../routes";
import { createShellQueryClient } from "./query-client";

export default function App({ runtimeConfig }: { runtimeConfig: Readonly<SellerRuntimeConfig> }) {
  const [queryClient] = useState(() => createShellQueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ShellPlatformProvider runtimeConfig={runtimeConfig}>
            <EntryLinkProvider runtimeConfig={runtimeConfig}>
              <AuthProvider onSessionCleared={() => queryClient.removeQueries({
                predicate: (query) => query.queryKey[0] !== "entry-root",
              })}>
                <EventStreamProvider>
                  <ShellRoutes />
                </EventStreamProvider>
              </AuthProvider>
            </EntryLinkProvider>
          </ShellPlatformProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
