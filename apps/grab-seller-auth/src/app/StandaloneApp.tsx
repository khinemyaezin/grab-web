import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { createStandalonePlatform } from "@khinemyaezin/seller-api";
import AuthRoutes from "./AuthRoutes";

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
          <AuthRoutes
            link={{ href: import.meta.env.VITE_API_IDENTITY_URL }}
            platform={platform}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
