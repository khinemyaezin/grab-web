import { useMemo, useState } from "react";
import { BrowserRouter, useNavigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { createStandalonePlatform } from "@khinemyaezin/seller-api";
import AppRoutes from "./Routes";

function StandaloneContent() {
  const navigate = useNavigate();
  const platform = useMemo(
    () =>
      createStandalonePlatform({
        baseUrl: "/api/v1",
        appName: "Seller Pricing Standalone",
        onNavigate: (path, opts) => {
          navigate(path, opts);
        },
      }),
    [navigate],
  );

  return (
    <>
      <Toaster />
      <AppRoutes platform={platform} />
    </>
  );
}

export default function StandaloneApp() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <StandaloneContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
