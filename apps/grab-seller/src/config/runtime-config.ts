import { defaultRuntimeConfig, type SellerRuntimeConfig } from "@khinemyaezin/seller-contracts";

function safeApiBaseUrl(value: unknown): string {
  if (typeof value !== "string") {
    return defaultRuntimeConfig.apiBaseUrl;
  }

  const apiBaseUrl = value.trim().replace(/\/$/, "");
  if (!apiBaseUrl || apiBaseUrl.startsWith("//")) {
    return defaultRuntimeConfig.apiBaseUrl;
  }

  if (apiBaseUrl.startsWith("/")) {
    return apiBaseUrl;
  }

  try {
    const url = new URL(apiBaseUrl);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return apiBaseUrl;
    }
  } catch {
    return defaultRuntimeConfig.apiBaseUrl;
  }

  return defaultRuntimeConfig.apiBaseUrl;
}

function createRuntimeConfig(input: SellerRuntimeConfig): Readonly<SellerRuntimeConfig> {
  return Object.freeze({
    appName: input.appName,
    apiBaseUrl: safeApiBaseUrl(input.apiBaseUrl)
  });
}

export async function loadRuntimeConfig(): Promise<Readonly<SellerRuntimeConfig>> {
  try {
    const response = await fetch("/runtime-config.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Runtime config request failed with ${response.status}`);
    }
    return createRuntimeConfig(await response.json());
  } catch (error) {
    console.warn("Using default runtime configuration", error);
    return createRuntimeConfig(defaultRuntimeConfig);
  }
}
