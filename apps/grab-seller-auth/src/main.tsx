import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StandaloneApp from "./app/StandaloneApp";
import "./styles-standalone.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <StandaloneApp />
  </StrictMode>,
);
