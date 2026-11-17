import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { loadRuntimeConfig } from "./config/runtime-config";
import "./styles.css";

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    console.error("[Global Error]", event.error ?? event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("[Unhandled Rejection]", event.reason);
  });
}

async function bootstrap() {
  const runtimeConfig = await loadRuntimeConfig();

  document.title = runtimeConfig.appName;

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App runtimeConfig={runtimeConfig} />
    </StrictMode>,
  );
}

void bootstrap();
