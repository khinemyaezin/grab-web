import { afterEach, describe, expect, it, vi } from "vitest";
import {
  RuntimeConfigError,
  loadRuntimeConfig,
  validateApiBaseUrl,
  validateEventStreamUrl,
  validateRuntimeConfig,
} from "./runtime-config";

describe("runtime-config validation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("validates valid relative and absolute apiBaseUrl", () => {
    expect(validateApiBaseUrl("/api/v1")).toBe("/api/v1");
    expect(validateApiBaseUrl("https://api.seller.grab.com")).toBe("https://api.seller.grab.com");
    expect(validateApiBaseUrl("http://localhost:8080/")).toBe("http://localhost:8080");
  });

  it("fails fast when apiBaseUrl is missing, empty, or not a string", () => {
    expect(() => validateApiBaseUrl("")).toThrow(RuntimeConfigError);
    expect(() => validateApiBaseUrl("   ")).toThrow(
      "apiBaseUrl is required and must be a non-empty string",
    );
    expect(() => validateApiBaseUrl(undefined)).toThrow(RuntimeConfigError);
    expect(() => validateApiBaseUrl(null)).toThrow(RuntimeConfigError);
  });

  it("fails fast when apiBaseUrl is protocol-relative or invalid protocol", () => {
    expect(() => validateApiBaseUrl("//evil.com/api")).toThrow(
      "apiBaseUrl cannot start with protocol-relative '//'",
    );
    expect(() => validateApiBaseUrl("ftp://api.test")).toThrow(
      "apiBaseUrl protocol must be http: or https:",
    );
  });

  it("validates optional eventStreamUrl", () => {
    expect(validateEventStreamUrl(undefined)).toBeUndefined();
    expect(validateEventStreamUrl("")).toBeUndefined();
    expect(validateEventStreamUrl("/events")).toBe("/events");
    expect(validateEventStreamUrl("https://sse.seller.grab.com/stream")).toBe(
      "https://sse.seller.grab.com/stream",
    );
    expect(() => validateEventStreamUrl("ftp://sse.com")).toThrow(
      "eventStreamUrl protocol must be http: or https:",
    );
  });

  it("validates a full runtime config object", () => {
    const config = validateRuntimeConfig({
      appName: "Custom Portal",
      apiBaseUrl: "https://api.grab.com",
      eventStreamUrl: "/sse",
    });

    expect(config).toEqual({
      appName: "Custom Portal",
      apiBaseUrl: "https://api.grab.com",
      eventStreamUrl: "/sse",
    });
    expect(Object.isFrozen(config)).toBe(true);
  });

  describe("loadRuntimeConfig", () => {
    it("loads and validates config from /runtime-config.json", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              appName: "Server Configured",
              apiBaseUrl: "/server-api",
            }),
        }),
      );

      const config = await loadRuntimeConfig();
      expect(config.appName).toBe("Server Configured");
      expect(config.apiBaseUrl).toBe("/server-api");
    });

    it("falls back to default config on fetch error", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Failed to fetch")));

      const config = await loadRuntimeConfig();
      expect(config.appName).toBe("Grab Store");
      expect(config.apiBaseUrl).toBe("/api/v1");
    });

    it("throws RuntimeConfigError if response contains invalid config", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              appName: "Bad Config",
              apiBaseUrl: "",
            }),
        }),
      );

      await expect(loadRuntimeConfig()).rejects.toThrow(RuntimeConfigError);
    });
  });
});
