import { useMemo, useState } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { createStandalonePlatform } from "@khinemyaezin/seller-api";

export default function StandaloneApp() {
  const [queryClient] = useState(() => new QueryClient());
  const platform = useMemo(
    () =>
      createStandalonePlatform({
        baseUrl: "/api/v1",
        appName: "Pricing Standalone",
      }),
    [],
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <Toaster />
          <AppRoutes platform={platform} />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
