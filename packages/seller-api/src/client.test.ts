import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "./client.js";

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

  it("retries on 401 with refreshed token", async () => {
    let token = "old-token";
    const refreshMock = vi.fn().mockImplementation(async () => {
      token = "refreshed-token";
    });

    const mockResponse401 = {
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: () => Promise.resolve({ error: "expired" }),
    };

    const mockResponse200 = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/hal+json" }),
      text: () => Promise.resolve(JSON.stringify({ success: true })),
    };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse401)
      .mockResolvedValueOnce(mockResponse200);
    vi.stubGlobal("fetch", fetchMock);

    const client = createApiClient({
      baseUrl: "https://api.test",
      getToken: () => token,
      platform: {
        session: {
          refresh: refreshMock,
        },
      },
    });

    const result = await client.get<{ success: boolean }>("/data");

    expect(result).toEqual({ success: true });
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Verify first request had old token
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer old-token");
    // Verify retry request had fresh token
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer refreshed-token");
  });
});
