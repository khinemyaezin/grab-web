import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const mfTypes = fileURLToPath(new URL("./@mf-types", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      grab_seller_auth: `${mfTypes}/grab_seller_auth`,
      grab_seller_account: `${mfTypes}/grab_seller_account`,
      grab_seller_product: `${mfTypes}/grab_seller_product`,
      grab_seller_inventory: `${mfTypes}/grab_seller_inventory`,
      grab_seller_pricing: `${mfTypes}/grab_seller_pricing`,
    },
    dedupe: ["react", "react-dom"],
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    server: {
      deps: {
        inline: [/@khinemyaezin\/seller-/],
      },
    },
  },
});
