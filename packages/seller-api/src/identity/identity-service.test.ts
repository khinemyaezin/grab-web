import { describe, it, expect, vi, beforeEach } from "vitest";
import { createIdentityService } from "./identity-service.js";
import { identityLinkDiscovery } from "./link-discovery.js";
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
    logout: { href: "/api/logout" },
    refreshToken: { href: "/api/refresh" },
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
    it("fetches profile with retryOnUnauthorized: false and maps fields correctly", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockResolvedValueOnce(sampleRawProfile);

      const service = createIdentityService(mockApi, mockEntryLink);
      const profile = await service.getProfile();

      expect(mockApi.followLink).toHaveBeenCalledWith(
        mockIdentityRoot.getProfile,
        "GET",
        undefined,
        undefined,
        undefined,
        { retryOnUnauthorized: false },
      );

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

  describe("logout", () => {
    it("calls root.logout with retryOnUnauthorized: false", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockResolvedValueOnce(undefined);

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.logout();

      expect(mockApi.followLink).toHaveBeenCalledWith(
        mockIdentityRoot.logout,
        "POST",
        undefined,
        undefined,
        undefined,
        { retryOnUnauthorized: false },
      );
    });

    it("throws if identity root does not expose logout", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce({});
      const service = createIdentityService(mockApi, mockEntryLink);

      await expect(service.logout()).rejects.toThrow(
        "Identity root does not expose a 'logout' link",
      );
    });
  });

  describe("refreshToken", () => {
    it("calls root.refreshToken with retryOnUnauthorized: false", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(mockApi.followLink).mockResolvedValueOnce(undefined);

      const service = createIdentityService(mockApi, mockEntryLink);
      await service.refreshToken();

      expect(mockApi.followLink).toHaveBeenCalledWith(
        mockIdentityRoot.refreshToken,
        "POST",
        undefined,
        undefined,
        undefined,
        { retryOnUnauthorized: false },
      );
    });

    it("throws if identity root does not expose refresh", async () => {
      vi.mocked(identityLinkDiscovery.root).mockResolvedValueOnce({});
      const service = createIdentityService(mockApi, mockEntryLink);

      await expect(service.refreshToken()).rejects.toThrow(
        "Identity root does not expose a 'refresh' link",
      );
    });
  });
});
