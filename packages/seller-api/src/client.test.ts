import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, createApiClient } from "./client.js";

describe("createApiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates an isolated client using its own baseUrl", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/hal+json" }),
      text: () => Promise.resolve(JSON.stringify({ hello: "world" })),
    });
    vi.stubGlobal("fetch", fetchMock);

    const clientA = createApiClient({ baseUrl: "https://api.a.com" });
    const clientB = createApiClient({ baseUrl: "https://api.b.com" });

    await clientA.get("/users");
    expect(fetchMock).toHaveBeenCalledWith("https://api.a.com/users", expect.any(Object));

    await clientB.get("/items");
    expect(fetchMock).toHaveBeenCalledWith("https://api.b.com/items", expect.any(Object));
  });

  describe("401 unauthorized handling & concurrency", () => {
    it("retries on 401 with refreshed token", async () => {
      let token = "old-token";
      const refreshMock = vi.fn().mockImplementation(async () => {
        token = "refreshed-token";
      });
      const expireMock = vi.fn();

      const mockResponse401 = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ error: "expired" }),
        text: () => Promise.resolve(JSON.stringify({ error: "expired" })),
      };

      const mockResponse200 = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/hal+json" }),
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      };

      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mockResponse401)
        .mockResolvedValueOnce(mockResponse200);
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({
        baseUrl: "https://api.test",
        getToken: () => token,
        platform: {
          session: {
            refresh: refreshMock,
            expire: expireMock,
          },
        },
      });

      const result = await client.get<{ success: boolean }>("/data");

      expect(result).toEqual({ success: true });
      expect(refreshMock).toHaveBeenCalledTimes(1);
      expect(expireMock).not.toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(2);

      // Verify first request had old token
      expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer old-token");
      // Verify retry request had fresh token
      expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer refreshed-token");
    });

    it("does not trigger refresh when retryOnUnauthorized: false", async () => {
      const refreshMock = vi.fn();
      const expireMock = vi.fn();

      const mockResponse401 = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ error: "unauthorized" }),
        text: () => Promise.resolve(JSON.stringify({ error: "unauthorized" })),
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse401));

      const client = createApiClient({
        baseUrl: "https://api.test",
        platform: {
          session: {
            refresh: refreshMock,
            expire: expireMock,
          },
        },
      });

      await expect(
        client.get("/data", undefined, undefined, { retryOnUnauthorized: false }),
      ).rejects.toThrow("API Error: 401 Unauthorized");

      expect(refreshMock).not.toHaveBeenCalled();
      expect(expireMock).not.toHaveBeenCalled();
    });

    it("expires session with 'refresh-failed' when refresh rejects with 401/403", async () => {
      const refreshMock = vi.fn().mockRejectedValue(new ApiError(401, "Unauthorized", null));
      const expireMock = vi.fn();

      const mockResponse401 = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ error: "expired" }),
        text: () => Promise.resolve(JSON.stringify({ error: "expired" })),
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse401));

      const client = createApiClient({
        baseUrl: "https://api.test",
        platform: {
          session: {
            refresh: refreshMock,
            expire: expireMock,
          },
        },
      });

      await expect(client.get("/data")).rejects.toThrow("API Error: 401 Unauthorized");

      expect(refreshMock).toHaveBeenCalledTimes(1);
      expect(expireMock).toHaveBeenCalledWith("refresh-failed");
    });

    it("does not expire session when refresh rejects with a network error", async () => {
      const networkError = new TypeError("Failed to fetch");
      const refreshMock = vi.fn().mockRejectedValue(networkError);
      const expireMock = vi.fn();

      const mockResponse401 = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ error: "expired" }),
        text: () => Promise.resolve(JSON.stringify({ error: "expired" })),
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse401));

      const client = createApiClient({
        baseUrl: "https://api.test",
        platform: {
          session: {
            refresh: refreshMock,
            expire: expireMock,
          },
        },
      });

      await expect(client.get("/data")).rejects.toThrow("Failed to fetch");

      expect(refreshMock).toHaveBeenCalledTimes(1);
      expect(expireMock).not.toHaveBeenCalled();
    });

    it("expires session with 'unauthorized' when retry also returns 401", async () => {
      const refreshMock = vi.fn().mockResolvedValue(undefined);
      const expireMock = vi.fn();

      const mockResponse401 = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ error: "still unauthorized" }),
        text: () => Promise.resolve(JSON.stringify({ error: "still unauthorized" })),
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse401));

      const client = createApiClient({
        baseUrl: "https://api.test",
        platform: {
          session: {
            refresh: refreshMock,
            expire: expireMock,
          },
        },
      });

      await expect(client.get("/data")).rejects.toThrow("API Error: 401 Unauthorized");

      expect(refreshMock).toHaveBeenCalledTimes(1);
      expect(expireMock).toHaveBeenCalledWith("unauthorized");
    });
  });

  describe("content-type and body parsing", () => {
    it("parses application/json responses correctly", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        text: () => Promise.resolve(JSON.stringify({ token: "abc", user: { id: "1" } })),
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });
      const res = await client.post<{ token: string }>("/login", { email: "a@b.com" });

      expect(res).toEqual({ token: "abc", user: { id: "1" } });
    });

    it("returns undefined for 204 No Content", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        headers: new Headers(),
        text: () => Promise.resolve(""),
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });
      const res = await client.delete<void>("/items/1");

      expect(res).toBeUndefined();
    });

    it("returns undefined for empty body responses", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-length": "0" }),
        text: () => Promise.resolve(""),
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });
      const res = await client.get("/empty");

      expect(res).toBeUndefined();
    });

    it("parses application/problem+json on error and includes data in ApiError", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: new Headers({ "content-type": "application/problem+json" }),
        json: () =>
          Promise.resolve({
            type: "https://api.example.com/errors/invalid-input",
            title: "Validation Error",
            status: 422,
            detail: "Field 'name' is required",
          }),
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });

      await expect(client.post("/items", {})).rejects.toMatchObject({
        name: "ApiError",
        status: 422,
        statusText: "Unprocessable Entity",
        data: {
          title: "Validation Error",
          detail: "Field 'name' is required",
        },
      });
    });

    it("falls back to raw text when response is plain text", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "text/plain" }),
        text: () => Promise.resolve("OK-PONG"),
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });
      const res = await client.get<string>("/healthz");

      expect(res).toBe("OK-PONG");
    });
  });
});
