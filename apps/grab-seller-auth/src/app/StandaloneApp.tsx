import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import AuthRoutes from "./AuthRoutes";

export default function StandaloneApp() {
  const [client] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Toaster />
          <AuthRoutes link={{ href: import.meta.env.VITE_API_IDENTITY_URL, }} />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
