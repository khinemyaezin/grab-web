import React, { ReactNode } from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { SellerPlatform, SessionApi, SessionSnapshot } from "@khinemyaezin/seller-contracts";
import { PlatformProvider } from "@khinemyaezin/seller-ui";
import UserMenuWidget from "./user-menu-widget";

vi.mock("../../access/components/access-context-menu", () => ({
  default: () => <div data-testid="access-context-menu" />,
}));

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
    events: { emit: vi.fn(), subscribe: vi.fn(), clear: vi.fn() } as any,
    navigation: { navigate: vi.fn() },
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

describe("UserMenuWidget", () => {
  it("renders null when session is anonymous", () => {
    const { platform } = createMockPlatform({ status: "anonymous" });
    const { container } = render(
      <PlatformProvider platform={platform}>
        <UserMenuWidget onLogout={vi.fn()} trigger={<button>Open Menu</button>} />
      </PlatformProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("updates reactively when session transitions to authenticated", () => {
    const { platform, publish } = createMockPlatform({ status: "anonymous" });
    const { container } = render(
      <PlatformProvider platform={platform}>
        <UserMenuWidget onLogout={vi.fn()} trigger={<button>Open Menu</button>} />
      </PlatformProvider>,
    );

    expect(container.firstChild).toBeNull();

    act(() => {
      publish({
        status: "authenticated",
        user: {
          id: "u-123",
          email: "seller@grab.com",
          name: "Test Seller",
          avatar: "https://avatar.test/pic.png",
          accessContexts: [],
        },
        roles: ["SELLER"],
        permissions: [],
      });
    });

    expect(screen.getByRole("button", { name: "Open Menu" })).toBeInTheDocument();
  });
});
