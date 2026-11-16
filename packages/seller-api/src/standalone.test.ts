import { describe, it, expect, vi } from "vitest";
import type { SessionSnapshot } from "@khinemyaezin/seller-contracts";
import { createStandalonePlatform } from "./standalone";

describe("createStandalonePlatform", () => {
  it("implements the full SellerPlatform contract without any undefined members", () => {
    const platform = createStandalonePlatform({
      appName: "Test Standalone",
      baseUrl: "https://api.test",
    });

    expect(platform.version).toBe("1.0.0");
    expect(platform.config).toEqual({
      appName: "Test Standalone",
      apiBaseUrl: "https://api.test",
    });
    expect(typeof platform.session.getSnapshot).toBe("function");
    expect(typeof platform.session.subscribe).toBe("function");
    expect(typeof platform.session.refresh).toBe("function");
    expect(typeof platform.session.expire).toBe("function");
    expect(typeof platform.session.logout).toBe("function");
    expect(typeof platform.events.emit).toBe("function");
    expect(typeof platform.events.subscribe).toBe("function");
    expect(typeof platform.navigation.navigate).toBe("function");
    expect(typeof platform.api.followLink).toBe("function");
  });

  it("notifies subscribers when expire() is called and transitions to anonymous", () => {
    const platform = createStandalonePlatform();
    const initialSnapshot = platform.session.getSnapshot();
    expect(initialSnapshot.status).toBe("authenticated");

    const listener = vi.fn();
    const unsubscribe = platform.session.subscribe(listener);

    platform.session.expire();

    expect(platform.session.getSnapshot()).toEqual({ status: "anonymous" });
    expect(listener).toHaveBeenCalledWith({ status: "anonymous" });

    unsubscribe();
    platform.session.expire();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("notifies subscribers when logout() is called and transitions to anonymous", async () => {
    const platform = createStandalonePlatform();
    const listener = vi.fn();
    platform.session.subscribe(listener);

    await platform.session.logout();

    expect(platform.session.getSnapshot()).toEqual({ status: "anonymous" });
    expect(listener).toHaveBeenCalledWith({ status: "anonymous" });
  });

  it("refreshes back to authenticated dev snapshot", async () => {
    const platform = createStandalonePlatform();
    platform.session.expire();
    expect(platform.session.getSnapshot().status).toBe("anonymous");

    const snapshots: SessionSnapshot[] = [];
    platform.session.subscribe((snap) => snapshots.push(snap));

    await platform.session.refresh();

    const current = platform.session.getSnapshot();
    expect(current.status).toBe("authenticated");
    if (current.status === "authenticated") {
      expect(current.user.id).toBe("standalone-dev");
    }
  });

  it("wires the API client to the standalone session for 401 handling", async () => {
    const platform = createStandalonePlatform({
      baseUrl: "https://api.test",
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ message: "Unauthorized" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const listener = vi.fn();
    platform.session.subscribe(listener);

    await expect(
      platform.api.followLink({ href: "https://api.test/data" }, "GET"),
    ).rejects.toThrow();

    // After retry fails with 401, expire should have been invoked on session
    expect(platform.session.getSnapshot().status).toBe("anonymous");
    expect(listener).toHaveBeenCalledWith({ status: "anonymous" });

    vi.unstubAllGlobals();
  });
});
