import { act, renderHook } from "@testing-library/react";
import React, { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import type { SellerPlatform, SessionApi, SessionSnapshot } from "@khinemyaezin/seller-contracts";
import { PlatformProvider } from "../context/platform-provider.js";
import { useAuthState, useSessionSnapshot } from "./use-session.js";

function createMockPlatform(initialSnapshot: SessionSnapshot = { status: "anonymous" }): {
  platform: SellerPlatform;
  publish: (next: SessionSnapshot) => void;
} {
  let current = initialSnapshot;
  const listeners = new Set<(s: SessionSnapshot) => void>();

  const session: SessionApi = {
    getSnapshot: () => current,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    refresh: async () => {},
    expire: () => {},
    logout: async () => {},
  };

  const platform: SellerPlatform = {
    version: "1.0.0",
    session,
    events: {} as any,
    navigation: { navigate: () => {} },
    config: {} as any,
    api: {} as any,
  };

  return {
    platform,
    publish: (next: SessionSnapshot) => {
      current = next;
      listeners.forEach((l) => l(next));
    },
  };
}

describe("useSessionSnapshot", () => {
  it("throws if rendered outside PlatformProvider", () => {
    expect(() => renderHook(() => useSessionSnapshot())).toThrow(
      "useRequiredPlatform must be used within a PlatformProvider",
    );
  });

  it("returns the initial session snapshot and updates reactively on change", () => {
    const { platform, publish } = createMockPlatform({ status: "loading" });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <PlatformProvider platform={platform}>{children}</PlatformProvider>
    );

    const { result } = renderHook(() => useSessionSnapshot(), { wrapper });
    expect(result.current).toEqual({ status: "loading" });

    const authSnapshot: SessionSnapshot = {
      status: "authenticated",
      user: {
        id: "u-1",
        email: "u1@grab.com",
        name: "User One",
        accessContexts: [],
      },
      roles: ["SELLER"],
      permissions: ["catalog:write"],
    };

    act(() => {
      publish(authSnapshot);
    });

    expect(result.current).toEqual(authSnapshot);
  });
});

describe("useAuthState", () => {
  it("computes authenticated state and user correctly", () => {
    const authSnapshot: SessionSnapshot = {
      status: "authenticated",
      user: {
        id: "u-1",
        email: "u1@grab.com",
        name: "User One",
        accessContexts: [],
      },
      roles: ["SELLER"],
      permissions: ["catalog:write"],
    };

    const { platform, publish } = createMockPlatform(authSnapshot);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <PlatformProvider platform={platform}>{children}</PlatformProvider>
    );

    const { result } = renderHook(() => useAuthState(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user?.id).toBe("u-1");

    act(() => {
      publish({ status: "anonymous" });
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
