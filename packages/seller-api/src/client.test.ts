import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AbortError,
  ApiError,
  TimeoutError,
  createApiClient,
  isAbortError,
  isApiError,
  isNotFound,
  isTimeoutError,
  isUnauthorized,
} from "./client.js";

describe("createApiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
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

  describe("OIDC unauthorized handling", () => {
    it("expires the session on 401 without refreshing or retrying", async () => {
      const expireMock = vi.fn();
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ error: "unauthorized" }),
        text: () => Promise.resolve(JSON.stringify({ error: "unauthorized" })),
      });
      vi.stubGlobal("fetch", fetchMock);
      const client = createApiClient({
        baseUrl: "https://api.test",
        platform: { session: { expire: expireMock } },
      });

      await expect(client.get("/data")).rejects.toThrow("API Error: 401 Unauthorized");

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(expireMock).toHaveBeenCalledWith("unauthorized");
    });

    it("does not expire the session on 403", async () => {
      const expireMock = vi.fn();
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 403,
          statusText: "Forbidden",
          headers: new Headers({ "content-type": "application/json" }),
          json: () => Promise.resolve({ error: "forbidden" }),
          text: () => Promise.resolve(JSON.stringify({ error: "forbidden" })),
        }),
      );
      const client = createApiClient({
        baseUrl: "https://api.test",
        platform: { session: { expire: expireMock } },
      });

      await expect(client.get("/data")).rejects.toMatchObject({ status: 403 });
      expect(expireMock).not.toHaveBeenCalled();
    });
  });

  describe("OIDC CSRF handling", () => {
    it("discovers and sends the dynamic CSRF header for unsafe requests", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              _links: { "get-identity-root": { href: "/api/v1/identity" } },
            }),
            { headers: { "content-type": "application/hal+json" } },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              _links: { "get-csrf-token": { href: "/api/v1/identity/auth/csrf" } },
            }),
            { headers: { "content-type": "application/hal+json" } },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              headerName: "X-CSRF-TOKEN",
              parameterName: "_csrf",
              token: "csrf-value",
            }),
            { headers: { "content-type": "application/hal+json" } },
          ),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ saved: true }), {
            headers: { "content-type": "application/json" },
          }),
        );
      vi.stubGlobal("fetch", fetchMock);
      const client = createApiClient({ baseUrl: "https://api.test/api/v1" });

      await client.post("/items", { name: "tea" });

      expect(fetchMock).toHaveBeenCalledTimes(4);
      const [url, init] = fetchMock.mock.calls[3] as [string, RequestInit];
      expect(url).toBe("https://api.test/api/v1/items");
      expect(init.credentials).toBe("include");
      expect(new Headers(init.headers).get("x-csrf-token")).toBe("csrf-value");
    });

    it("sends credentialed safe requests without CSRF discovery", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        text: () => Promise.resolve("{}"),
      });
      vi.stubGlobal("fetch", fetchMock);
      const client = createApiClient({ baseUrl: "https://api.test" });

      await client.get("/items");

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(fetchMock.mock.calls[0]?.[1].credentials).toBe("include");
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
      const res = await client.get<{ token: string }>("/login");

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
      const res = await client.get<void>("/items/1");

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

    it("parses application/problem+json on error and includes data, code, detail, and requestId in ApiError", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: new Headers({
          "content-type": "application/problem+json",
          "x-request-id": "req-987",
        }),
        json: () =>
          Promise.resolve({
            type: "https://api.example.com/errors/invalid-input",
            title: "Validation Error",
            code: "VALIDATION_FAILED",
            detail: "Field 'name' is required",
          }),
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });

      let caughtError: unknown;
      try {
        await client.get("/items");
      } catch (err) {
        caughtError = err;
      }

      expect(isApiError(caughtError)).toBe(true);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(422);
      expect(apiErr.statusText).toBe("Unprocessable Entity");
      expect(apiErr.code).toBe("VALIDATION_FAILED");
      expect(apiErr.detail).toBe("Field 'name' is required");
      expect(apiErr.requestId).toBe("req-987");
      expect(apiErr.body).toEqual({
        type: "https://api.example.com/errors/invalid-input",
        title: "Validation Error",
        code: "VALIDATION_FAILED",
        detail: "Field 'name' is required",
      });
      expect(apiErr.data).toEqual(apiErr.body);
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

  describe("timeout and abort handling", () => {
    it("throws TimeoutError when request exceeds timeoutMs", async () => {
      const fetchMock = vi.fn().mockImplementation((_url, init) => {
        return new Promise((_resolve, reject) => {
          if (init?.signal?.aborted) {
            const err = new Error("The operation was aborted");
            err.name = "AbortError";
            reject(err);
            return;
          }
          init?.signal?.addEventListener("abort", () => {
            const err = new Error("The operation was aborted");
            err.name = "AbortError";
            reject(err);
          });
        });
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });
      const requestPromise = client.get("/slow-endpoint", undefined, undefined, {
        timeoutMs: 30,
      });

      await expect(requestPromise).rejects.toSatisfy((err) => {
        expect(isTimeoutError(err)).toBe(true);
        expect(err).toBeInstanceOf(TimeoutError);
        expect((err as TimeoutError).status).toBe(408);
        expect((err as TimeoutError).code).toBe("REQUEST_TIMEOUT");
        return true;
      });
    });

    it("throws AbortError when caller signal aborts", async () => {
      const controller = new AbortController();

      const fetchMock = vi.fn().mockImplementation((_url, init) => {
        return new Promise((_resolve, reject) => {
          if (init?.signal?.aborted) {
            const err = new Error("The operation was aborted");
            err.name = "AbortError";
            reject(err);
            return;
          }
          init?.signal?.addEventListener("abort", () => {
            const err = new Error("The operation was aborted");
            err.name = "AbortError";
            reject(err);
          });
        });
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });
      const requestPromise = client.get("/endpoint", undefined, undefined, {
        signal: controller.signal,
      });

      await Promise.resolve();
      controller.abort();

      await expect(requestPromise).rejects.toSatisfy((err) => {
        expect(isAbortError(err)).toBe(true);
        expect(err).toBeInstanceOf(AbortError);
        expect((err as AbortError).code).toBe("REQUEST_ABORTED");
        return true;
      });
    });
  });

  describe("type helpers", () => {
    it("identifies error types correctly", () => {
      const err401 = new ApiError(401, "Unauthorized", null);
      const err404 = new ApiError(404, "Not Found", null);
      const timeoutErr = new TimeoutError(5000);
      const abortErr = new AbortError();

      expect(isApiError(err401)).toBe(true);
      expect(isUnauthorized(err401)).toBe(true);
      expect(isUnauthorized(err404)).toBe(false);

      expect(isNotFound(err404)).toBe(true);
      expect(isNotFound(err401)).toBe(false);

      expect(isTimeoutError(timeoutErr)).toBe(true);
      expect(isTimeoutError(err401)).toBe(false);

      expect(isAbortError(abortErr)).toBe(true);
      expect(isAbortError(err401)).toBe(false);
    });
  });

  describe("followLink template expansion integration", () => {
    it("expands templated links with params and queries endpoints", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        text: () => Promise.resolve(JSON.stringify({ ok: true })),
      });
      vi.stubGlobal("fetch", fetchMock);

      const client = createApiClient({ baseUrl: "https://api.test" });

      await client.followLink(
        { href: "/api/v1/merchants/{id}/storefronts{?page}", templated: true },
        "GET",
        undefined,
        { id: "m-789", page: "2" },
      );

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.test/api/v1/merchants/m-789/storefronts?page=2",
        expect.any(Object),
      );
    });
  });
});
