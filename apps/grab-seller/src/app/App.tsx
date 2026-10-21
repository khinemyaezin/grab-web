import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@khinemyaezin/seller-ui";
import type { SellerRuntimeConfig } from "@khinemyaezin/seller-contracts";
import { AuthProvider } from "./AuthProvider";
import { EntryLinkProvider } from "./EntryLinkProvider";
import { ShellRoutes } from "../routes";

export default function App({ runtimeConfig }: { runtimeConfig: Readonly<SellerRuntimeConfig> }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EntryLinkProvider runtimeConfig={runtimeConfig}>
            <AuthProvider runtimeConfig={runtimeConfig} onSessionCleared={() => queryClient.clear()}>
              <ShellRoutes />
            </AuthProvider>
          </EntryLinkProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
