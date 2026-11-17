import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useLocation } from "react-router";
import type {
  IdentityProfile,
  SellerRuntimeConfig,
  SessionSnapshot,
} from "@khinemyaezin/seller-contracts";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./AuthContext";
import { useRequiredPlatform } from "@khinemyaezin/seller-ui";
import { ShellPlatformProvider } from "./ShellPlatformProvider";
import { EntryLinkContext } from "./EntryLinkContext";

const mockGetProfile = vi.fn();
const mockRefreshToken = vi.fn();
const mockLogout = vi.fn();

vi.mock("@khinemyaezin/seller-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@khinemyaezin/seller-api")>();
  return {
    ...actual,
    createIdentityService: vi.fn(() => ({
      getProfile: mockGetProfile,
      refreshToken: mockRefreshToken,
      logout: mockLogout,
    })),
  };
});

const runtimeConfig: Readonly<SellerRuntimeConfig> = {
  appName: "Grab Seller Test",
  apiBaseUrl: "http://api.test",
};

const sampleProfile: IdentityProfile = {
  id: "user-1",
  email: "seller@grab.com",
  name: "Seller One",
  avatar: "https://avatar.test/pic.png",
  roles: ["SELLER"],
  permissions: ["orders:read"],
  accessContexts: [
    {
      assignmentId: "assignment-1",
      platformCode: "SELLER",
      roleCode: "OWNER",
      scopeKey: "merchant",
      scopeId: "merchant-1",
      status: "ACTIVE",
    },
  ],
  currentAccessContext: {
    assignmentId: "assignment-1",
    platformCode: "SELLER",
    roleCode: "OWNER",
    scopeKey: "merchant",
    scopeId: "merchant-1",
    status: "ACTIVE",
  },
};

function TestConsumer() {
  const { snapshot, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  return (
    <div>
      <div data-testid="status">{snapshot.status}</div>
      <div data-testid="is-authenticated">{String(isAuthenticated)}</div>
      <div data-testid="is-loading">{String(isLoading)}</div>
      <div data-testid="pathname">{location.pathname}</div>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("triggers one bootstrap during StrictMode double mount", async () => {
    mockGetProfile.mockResolvedValue(sampleProfile);

    render(
      <React.StrictMode>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <ShellPlatformProvider runtimeConfig={runtimeConfig}>
            <EntryLinkContext.Provider value={{ identity: { href: "/api/v1/identity" } }}>
              <AuthProvider>
                <TestConsumer />
              </AuthProvider>
            </EntryLinkContext.Provider>
          </ShellPlatformProvider>
        </MemoryRouter>
      </React.StrictMode>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("authenticated");
    });

    expect(screen.getByTestId("is-authenticated").textContent).toBe("true");
    expect(mockGetProfile).toHaveBeenCalledTimes(1);
  });

  it("does not trigger state updates after unmount", async () => {
    let resolveProfile: (profile: IdentityProfile) => void;
    const pendingPromise = new Promise<IdentityProfile>((resolve) => {
      resolveProfile = resolve;
    });
    mockGetProfile.mockReturnValue(pendingPromise);

    const { unmount } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ShellPlatformProvider runtimeConfig={runtimeConfig}>
          <EntryLinkContext.Provider value={{ identity: { href: "/api/v1/identity" } }}>
            <AuthProvider>
              <TestConsumer />
            </AuthProvider>
          </EntryLinkContext.Provider>
        </ShellPlatformProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("status").textContent).toBe("loading");

    // Unmount before promise resolves
    unmount();

    // Resolving promise now should not cause unhandled errors or updates
    resolveProfile!(sampleProfile);
    await new Promise((r) => setTimeout(r, 20));

    expect(mockGetProfile).toHaveBeenCalledTimes(1);
  });

  it("redirects to anonymous route only after bootstrap resolves with 401", async () => {
    let rejectProfile: (error: unknown) => void;
    const pendingPromise = new Promise<IdentityProfile>((_, reject) => {
      rejectProfile = reject;
    });
    mockGetProfile.mockReturnValue(pendingPromise);

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ShellPlatformProvider runtimeConfig={runtimeConfig}>
          <EntryLinkContext.Provider value={{ identity: { href: "/api/v1/identity" } }}>
            <AuthProvider>
              <TestConsumer />
            </AuthProvider>
          </EntryLinkContext.Provider>
        </ShellPlatformProvider>
      </MemoryRouter>,
    );

    // While loading, should NOT redirect to /login
    expect(screen.getByTestId("status").textContent).toBe("loading");
    expect(screen.getByTestId("pathname").textContent).toBe("/dashboard");

    // Reject with 401
    rejectProfile!({ status: 401 });

    // Now after resolving, it should redirect to /login
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("anonymous");
      expect(screen.getByTestId("pathname").textContent).toBe("/login");
    });
  });

  it("installs the session bridge before child effects and matches platform.session.getSnapshot()", async () => {
    mockGetProfile.mockResolvedValue(sampleProfile);

    let observedAuthSnapshot: SessionSnapshot | undefined;
    let observedPlatformSnapshot: SessionSnapshot | undefined;

    function InspectionConsumer() {
      const auth = useAuth();
      const platform = useRequiredPlatform();
      observedAuthSnapshot = auth.snapshot;
      observedPlatformSnapshot = platform.session.getSnapshot();
      return <div>Inspected</div>;
    }

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ShellPlatformProvider runtimeConfig={runtimeConfig}>
          <EntryLinkContext.Provider value={{ identity: { href: "/api/v1/identity" } }}>
            <AuthProvider>
              <InspectionConsumer />
            </AuthProvider>
          </EntryLinkContext.Provider>
        </ShellPlatformProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(observedAuthSnapshot?.status).toBe("authenticated");
    });

    expect(observedAuthSnapshot).toEqual(observedPlatformSnapshot);
  });
});
