import { describe, it, expect, vi, beforeEach } from "vitest";
import { createIdentityService } from "./identity-service.js";
import { identityLinkDiscovery } from "./link-discovery.js";
import { ApiError } from "../client.js";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "../hateoas.js";
import type { IdentityLinks, RawIdentityProfile } from "./types.js";

vi.mock("./link-discovery.js", () => ({
  identityLinkDiscovery: {
    root: vi.fn(),
  },
}));

describe("createIdentityService", () => {
  const mockApi = {
    followLink: vi.fn(),
  } as unknown as PlatformApiClient;

  const mockEntryLink: HateoasLink = { href: "/api/identity" };
  const mockIdentityRoot: IdentityLinks = {
    getProfile: { href: "/api/profile" },
    login: { href: "http://localhost:9000/oauth2/authorize?client_id=seller-bff" },
    logout: { href: "/api/logout" },
    csrfToken: { href: "/api/csrf" },
  };

  const sampleRawProfile: RawIdentityProfile = {
    id: "user-1",
    email: "seller@grab.com",
    name: "Grab Seller",
    avatar: "https://avatar.test/pic.png",
    createdAt: "2024-01-01T00:00:00Z",
    roles: ["MERCHANT_ADMIN"],
    permissions: ["product:write"],
    accessContexts: [
      {
        assignmentId: "asg-1",
        platformCode: "GRAB",
        roleCode: "SELLER",
        scopeKey: "merchant",
        scopeId: "m-123",
        status: "ACTIVE",
      },
    ],
    currentAccessContext: {
      assignmentId: "asg-1",
      platformCode: "GRAB",
      roleCode: "SELLER",
      scopeKey: "merchant",
      scopeId: "m-123",
      status: "ACTIVE",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ensureDiscovery caching", () => {
    it("caches the discovery result across multiple calls", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockResolvedValue(sampleRawProfile);

      const service = createIdentityService(mockApi, mockEntryLink);

      await service.getProfile();
      await service.getProfile();

      expect(identityLinkDiscovery.root).toHaveBeenCalledTimes(1);
      expect(identityLinkDiscovery.root).toHaveBeenCalledWith(mockApi, mockEntryLink);
    });

    it("retries discovery on next call if it failed previously", async () => {
      const error = new Error("Network error");
      vi.mocked(identityLinkDiscovery.root)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockIdentityRoot);

      const service = createIdentityService(mockApi, mockEntryLink);

      await expect(service.getProfile()).rejects.toThrow(error);

      vi.mocked(mockApi.followLink).mockResolvedValueOnce(sampleRawProfile);
      await service.getProfile();

      expect(identityLinkDiscovery.root).toHaveBeenCalledTimes(2);
    });
  });

  describe("getProfile", () => {
    it("fetches the BFF session profile and maps fields correctly", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockResolvedValueOnce(sampleRawProfile);

      const service = createIdentityService(mockApi, mockEntryLink);
      const profile = await service.getProfile();

      expect(mockApi.followLink).toHaveBeenCalledWith(mockIdentityRoot.getProfile, "GET");

      expect(profile).toEqual({
        id: "user-1",
        email: "seller@grab.com",
        name: "Grab Seller",
        avatar: "https://avatar.test/pic.png",
        createdAt: "2024-01-01T00:00:00Z",
        roles: ["MERCHANT_ADMIN"],
        permissions: ["product:write"],
        accessContexts: sampleRawProfile.accessContexts,
        currentAccessContext: sampleRawProfile.currentAccessContext,
      });
    });

    it("falls back to email local-part for name and undefined for missing avatar", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockResolvedValueOnce({
        ...sampleRawProfile,
        name: undefined,
        avatar: undefined,
      });

      const service = createIdentityService(mockApi, mockEntryLink);
      const profile = await service.getProfile();

      expect(profile.name).toBe("seller");
      expect(profile.avatar).toBeUndefined();
    });

    it("throws if identity root does not expose getProfile", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce({});
      const service = createIdentityService(mockApi, mockEntryLink);

      await expect(service.getProfile()).rejects.toThrow(
        "Identity root does not expose a 'get-profile' link",
      );
    });
  });

  describe("login", () => {
    it("navigates to discovered login URL via window.location.assign", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      const assignMock = vi.fn();
      vi.stubGlobal("window", { location: { assign: assignMock, href: "http://localhost/" } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.login();

      expect(assignMock).toHaveBeenCalledWith(
        "http://localhost:9000/oauth2/authorize?client_id=seller-bff",
      );
      vi.unstubAllGlobals();
    });

    it("falls back to window.location.href when window.location.assign is not available", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      const windowLocation = { href: "http://localhost/" };
      vi.stubGlobal("window", { location: windowLocation });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.login();

      expect(windowLocation.href).toBe(
        "http://localhost:9000/oauth2/authorize?client_id=seller-bff",
      );
      vi.unstubAllGlobals();
    });

    it("throws if identity root does not expose a login link", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce({});
      const service = createIdentityService(mockApi, mockEntryLink);

      await expect(service.login()).rejects.toThrow("Identity root does not expose a 'login' link");
    });

    it("throws if window is undefined", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.stubGlobal("window", undefined);

      const service = createIdentityService(mockApi, mockEntryLink);
      await expect(service.login()).rejects.toThrow("OIDC login requires a browser window");
      vi.unstubAllGlobals();
    });
  });

  describe("logout", () => {
    it("calls POST root.logout and navigates to the returned logoutUrl", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      const targetLogoutUrl =
        "http://localhost:9000/connect/logout?id_token_hint=xyz&post_logout_redirect_uri=http://localhost:3000/";
      vi.mocked(mockApi.followLink).mockResolvedValueOnce({ logoutUrl: targetLogoutUrl });

      const assignMock = vi.fn();
      vi.stubGlobal("window", { location: { assign: assignMock, href: "http://localhost/" } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(mockApi.followLink).toHaveBeenCalledWith(mockIdentityRoot.logout, "POST");
      expect(assignMock).toHaveBeenCalledWith(targetLogoutUrl);
      vi.unstubAllGlobals();
    });

    it("supports url property if logoutUrl is omitted", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      const targetLogoutUrl = "http://localhost:9000/connect/logout?id_token_hint=xyz";
      vi.mocked(mockApi.followLink).mockResolvedValueOnce({ url: targetLogoutUrl });

      const assignMock = vi.fn();
      vi.stubGlobal("window", { location: { assign: assignMock } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(mockApi.followLink).toHaveBeenCalledWith(mockIdentityRoot.logout, "POST");
      expect(assignMock).toHaveBeenCalledWith(targetLogoutUrl);
      vi.unstubAllGlobals();
    });

    it("falls back to window.location.href when window.location.assign is not available", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      const targetLogoutUrl = "http://localhost:9000/connect/logout?id_token_hint=xyz";
      vi.mocked(mockApi.followLink).mockResolvedValueOnce({ logoutUrl: targetLogoutUrl });

      const windowLocation = { href: "http://localhost/" };
      vi.stubGlobal("window", { location: windowLocation });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(windowLocation.href).toBe(targetLogoutUrl);
      vi.unstubAllGlobals();
    });

    it("gracefully falls back to '/' when response does not contain logoutUrl", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockResolvedValueOnce({});

      const assignMock = vi.fn();
      vi.stubGlobal("window", { location: { assign: assignMock } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(assignMock).toHaveBeenCalledWith("/");
      vi.unstubAllGlobals();
    });

    it("extracts logoutUrl from ApiError body when backend responds with 303 See Other", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      const targetLogoutUrl =
        "http://localhost:9000/connect/logout?id_token_hint=xyz&post_logout_redirect_uri=http://localhost:3000/";
      const apiError = new ApiError(303, "See Other", { logoutUrl: targetLogoutUrl });
      vi.mocked(mockApi.followLink).mockRejectedValueOnce(apiError);

      const assignMock = vi.fn();
      vi.stubGlobal("window", { location: { assign: assignMock } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(mockApi.followLink).toHaveBeenCalledWith(mockIdentityRoot.logout, "POST");
      expect(assignMock).toHaveBeenCalledWith(targetLogoutUrl);
      vi.unstubAllGlobals();
    });

    it("falls back to '/' when backend responds with 303 ApiError without logoutUrl body", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      const apiError = new ApiError(303, "See Other", null);
      vi.mocked(mockApi.followLink).mockRejectedValueOnce(apiError);

      const assignMock = vi.fn();
      vi.stubGlobal("window", { location: { assign: assignMock } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(assignMock).toHaveBeenCalledWith("/");
      vi.unstubAllGlobals();
    });

    it("falls back to top-level HTML form submission when fetch fails with network error", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink)
        .mockRejectedValueOnce(new TypeError("Failed to fetch"))
        .mockResolvedValueOnce({ parameterName: "_csrf", token: "test-token" });

      const form = {
        method: "",
        action: "",
        hidden: false,
        append: vi.fn(),
        submit: vi.fn(),
      };
      const input = { type: "", name: "", value: "" };
      const documentMock = {
        createElement: vi.fn((tag: string) => (tag === "form" ? form : input)),
        body: { append: vi.fn() },
      };
      vi.stubGlobal("document", documentMock);
      vi.stubGlobal("window", { location: { href: "http://localhost:3000/" } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(form.submit).toHaveBeenCalledOnce();
      expect(form.method).toBe("POST");
      expect(form.action).toBe("http://localhost:3000/api/logout");
      expect(input).toEqual({ type: "hidden", name: "_csrf", value: "test-token" });
      expect(documentMock.body.append).toHaveBeenCalledWith(form);
      vi.unstubAllGlobals();
    });

    it("falls back to window.location.assign('/') when document is not defined and fetch fails", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockRejectedValueOnce(new TypeError("Failed to fetch"));

      const assignMock = vi.fn();
      vi.stubGlobal("document", undefined);
      vi.stubGlobal("window", { location: { assign: assignMock, href: "http://localhost:3000/" } });

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(assignMock).toHaveBeenCalledWith("/");
      vi.unstubAllGlobals();
    });

    it("throws if window is undefined", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.stubGlobal("window", undefined);

      const service = createIdentityService(mockApi, mockEntryLink);
      await expect(service.logout()).rejects.toThrow("OIDC logout requires a browser window");
      vi.unstubAllGlobals();
    });

    it("throws if identity root does not expose logout", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce({});
      const service = createIdentityService(mockApi, mockEntryLink);

      await expect(service.logout()).rejects.toThrow(
        "Identity root does not expose a 'logout' link",
      );
    });
  });
});
