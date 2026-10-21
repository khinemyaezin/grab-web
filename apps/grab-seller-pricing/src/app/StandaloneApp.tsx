import { BrowserRouter } from "react-router";
import AppRoutes from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function StandaloneApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
