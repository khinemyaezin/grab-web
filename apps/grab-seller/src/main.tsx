import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { configureApi } from "@khinemyaezin/seller-api";
import App from "./app/App";
import { loadRuntimeConfig } from "./config/runtime-config";
import "./styles.css";

async function bootstrap() {
  const runtimeConfig = await loadRuntimeConfig();

  configureApi({
    baseUrl: runtimeConfig.apiBaseUrl,
  });

  document.title = runtimeConfig.appName;

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App runtimeConfig={runtimeConfig} />
    </StrictMode>,
  );
}

void bootstrap();
