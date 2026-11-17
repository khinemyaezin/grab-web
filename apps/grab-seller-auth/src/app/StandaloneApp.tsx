import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useNavigate } from "react-router";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { createStandalonePlatform } from "@khinemyaezin/seller-api";
import AuthRoutes from "./AuthRoutes";

function StandaloneContent() {
  const navigate = useNavigate();
  const platform = useMemo(
    () =>
      createStandalonePlatform({
        baseUrl: "/api/v1",
        appName: "Seller Auth Standalone",
        onNavigate: (path, opts) => {
          navigate(path, opts);
        },
      }),
    [navigate],
  );

  return (
    <>
      <Toaster />
      <AuthRoutes link={{ href: import.meta.env.VITE_API_IDENTITY_URL }} platform={platform} />
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
