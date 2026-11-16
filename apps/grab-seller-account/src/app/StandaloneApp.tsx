import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { useMemo, useState } from "react";
import AppRoutes from "./AppRoutes";
import { createStandalonePlatform } from "@khinemyaezin/seller-api";

export default function StandaloneApp() {
  const [client] = useState(() => new QueryClient());
  const platform = useMemo(
    () =>
      createStandalonePlatform({
        baseUrl: "/api/v1",
        getToken: async () => {
          const token = localStorage.getItem("access_token");
          return token || undefined;
        },
      }),
    [],
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Toaster />
          <AppRoutes
            link={{ href: import.meta.env.VITE_API_MERCHANT_URL }}
            platform={platform}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
