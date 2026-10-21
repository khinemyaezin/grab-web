import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { useState } from 'react';
import AppRoutes from './AppRoutes';
import { configureApi } from '@khinemyaezin/seller-api';


configureApi({
  baseUrl: "/api/v1",
  getToken: async () => {
    const token = localStorage.getItem("access_token");
    return token || undefined;
  }
});

export default function StandaloneApp() {
   const [client] = useState(() => new QueryClient());
   
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Toaster />
          <AppRoutes link={{ href: import.meta.env.VITE_API_MERCHANT_URL, }} />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
