import { defaultRuntimeConfig, type SellerRuntimeConfig } from "@khinemyaezin/seller-contracts";

export class RuntimeConfigError extends Error {
  constructor(message: string) {
    super(`[RuntimeConfig] ${message}`);
    this.name = "RuntimeConfigError";
  }
}

export function validateApiBaseUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new RuntimeConfigError("apiBaseUrl is required and must be a non-empty string");
  }

  const trimmed = value.trim().replace(/\/$/, "");
  if (trimmed.startsWith("//")) {
    throw new RuntimeConfigError(
      `apiBaseUrl cannot start with protocol-relative '//': '${trimmed}'`,
    );
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new RuntimeConfigError(
        `apiBaseUrl protocol must be http: or https:, got '${parsed.protocol}'`,
      );
    }
    return trimmed;
  } catch (err) {
    if (err instanceof RuntimeConfigError) throw err;
    throw new RuntimeConfigError(
      `apiBaseUrl must be a valid absolute URL or relative path: '${trimmed}'`,
    );
  }
}

export function validateEventStreamUrl(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new RuntimeConfigError("eventStreamUrl must be a string if provided");
  }

  const trimmed = value.trim();
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new RuntimeConfigError(
        `eventStreamUrl protocol must be http: or https:, got '${parsed.protocol}'`,
      );
    }
    return trimmed;
  } catch (err) {
    if (err instanceof RuntimeConfigError) throw err;
    throw new RuntimeConfigError(
      `eventStreamUrl must be a valid absolute URL or relative path: '${trimmed}'`,
    );
  }
}

export function validateRuntimeConfig(input: unknown): Readonly<SellerRuntimeConfig> {
  if (!input || typeof input !== "object") {
    throw new RuntimeConfigError("Runtime config must be an object");
  }

  const record = input as Record<string, unknown>;
  const appName =
    typeof record.appName === "string" && record.appName.trim()
      ? record.appName.trim()
      : "Grab Seller Portal";

  const apiBaseUrl = validateApiBaseUrl(record.apiBaseUrl);
  const eventStreamUrl = validateEventStreamUrl(record.eventStreamUrl);

  return Object.freeze({
    ...record,
    appName,
    apiBaseUrl,
    ...(eventStreamUrl ? { eventStreamUrl } : {}),
  });
}

export async function loadRuntimeConfig(): Promise<Readonly<SellerRuntimeConfig>> {
  let response: Response;
  try {
    response = await fetch("/runtime-config.json", { cache: "no-store" });
  } catch (networkError) {
    console.warn(
      "[RuntimeConfig] Network error fetching runtime-config.json; falling back to defaults",
      networkError,
    );
    return validateRuntimeConfig(defaultRuntimeConfig);
  }

  if (!response.ok) {
    console.warn(
      `[RuntimeConfig] HTTP ${response.status} fetching runtime-config.json; falling back to defaults`,
    );
    return validateRuntimeConfig(defaultRuntimeConfig);
  }

  const data = await response.json();
  return validateRuntimeConfig(data);
}
