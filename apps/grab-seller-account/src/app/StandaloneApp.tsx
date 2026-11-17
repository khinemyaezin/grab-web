import { useMemo, useState } from "react";
import { BrowserRouter, useNavigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { createStandalonePlatform } from "@khinemyaezin/seller-api";
import AppRoutes from "./AppRoutes";

function StandaloneContent() {
  const navigate = useNavigate();
  const platform = useMemo(
    () =>
      createStandalonePlatform({
        baseUrl: "/api/v1",
        appName: "Seller Account Standalone",
        onNavigate: (path, opts) => {
          navigate(path, opts);
        },
      }),
    [navigate],
  );

  return (
    <>
      <Toaster />
      <AppRoutes link={{ href: import.meta.env.VITE_API_MERCHANT_URL }} platform={platform} />
    </>
  );
}

export default function StandaloneApp() {
  const [client] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <StandaloneContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
