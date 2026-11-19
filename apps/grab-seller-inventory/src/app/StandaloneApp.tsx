import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { createStandalonePlatform } from "@khinemyaezin/seller-api";
import LocationRoutes from "./LocationRoutes";
import StockRoutes from "./StockRoutes";

const inventoryUrl = import.meta.env.VITE_INVENTORY_API_URL ?? import.meta.env.VITE_CATALOG_API_URL;
const catalogUrl = import.meta.env.VITE_CATALOG_API_URL;

function StandaloneContent() {
  const navigate = useNavigate();
  const platform = useMemo(
    () =>
      createStandalonePlatform({
        baseUrl: "/api/v1",
        appName: "Seller Inventory Standalone",
        onNavigate: (path, opts) => {
          navigate(path, opts);
        },
      }),
    [navigate],
  );

  return (
    <main className="min-h-screen bg-background p-8">
      <Toaster />
      <Routes>
        <Route
          path="inventory/locations/*"
          element={<LocationRoutes link={{ href: inventoryUrl }} platform={platform} />}
        />
        <Route
          path="inventory/stocks/*"
          element={
            <StockRoutes
              link={{ href: inventoryUrl }}
              catalogLink={{ href: catalogUrl }}
              platform={platform}
            />
          }
        />
        <Route path="*" element={<Navigate to="inventory/locations" replace />} />
      </Routes>
    </main>
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
