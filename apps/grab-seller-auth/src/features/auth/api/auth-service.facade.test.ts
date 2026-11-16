import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAuthService } from "./auth-service.facade";
import { authService } from "./auth";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { IdentityLinks } from "../../shared/types/identity-model";
import { linkDiscoveryService } from "@/features/shared/api/link-discovery";

vi.mock("@/features/shared/api/link-discovery", () => ({
  linkDiscoveryService: {
    root: vi.fn(),
  },
}));

vi.mock("./auth", () => ({
  authService: {
    readProfile: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
  },
}));

describe("AuthServiceFacade", () => {
  const mockApi = {} as PlatformApiClient;
  const mockEntryLink: HateoasLink = { href: "/api/identity" };
  const mockIdentityRoot: IdentityLinks = {
    getProfile: { href: "/api/profile" },
    logout: { href: "/api/logout" },
    refreshToken: { href: "/api/refresh" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ensureDiscovery caching", () => {
    it("caches the discovery result on success", async () => {
      vi.mocked(linkDiscoveryService.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(authService.readProfile).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        createdAt: "2023-01-01",
        roles: [],
        status: "",
        accessContexts: [],
        currentAccessContext: {} as any,
        _links: {}
      });

      const facade = createAuthService(mockApi, mockEntryLink);

      await facade.getProfile();
      await facade.getProfile();

      expect(linkDiscoveryService.root).toHaveBeenCalledTimes(1);
      expect(linkDiscoveryService.root).toHaveBeenCalledWith(mockApi, mockEntryLink);
    });

    it("does not cache the discovery result on failure", async () => {
      const error = new Error("Network error");
      vi.mocked(linkDiscoveryService.root)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockIdentityRoot);

      const facade = createAuthService(mockApi, mockEntryLink);

      await expect(facade.getProfile()).rejects.toThrow(error);

      vi.mocked(authService.readProfile).mockResolvedValueOnce({
        id: "1",
        email: "test@example.com",
        createdAt: "2023-01-01",
        roles: [],
        status: "",
        accessContexts: [],
        currentAccessContext: {} as any,
        _links: {}
      });

      await facade.getProfile();

      expect(linkDiscoveryService.root).toHaveBeenCalledTimes(2);
    });
  });

  describe("getProfile", () => {
    it("maps the auth profile to the User contract", async () => {
      vi.mocked(linkDiscoveryService.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(authService.readProfile).mockResolvedValueOnce({
        id: "u-123",
        email: "test@example.com",
        createdAt: "2023-01-01T00:00:00Z",
        roles: [],
        status: "",
        accessContexts: [],
        currentAccessContext: {} as any,
        _links: {}
      });

      const facade = createAuthService(mockApi, mockEntryLink);
      const user = await facade.getProfile();

      expect(authService.readProfile).toHaveBeenCalledWith(mockApi, mockIdentityRoot.getProfile);
      expect(user).toEqual({
        id: "u-123",
        email: "test@example.com",
        name: "",
        avatar: "",
        createdAt: "2023-01-01T00:00:00Z",
        accessContexts: [],
        currentAccessContext: {},
      });
    });

    it("throws if identity root does not expose get-profile", async () => {
      vi.mocked(linkDiscoveryService.root).mockResolvedValueOnce({} as IdentityLinks);
      const facade = createAuthService(mockApi, mockEntryLink);

      await expect(facade.getProfile()).rejects.toThrow("Identity root does not expose a 'get-profile' link");
    });
  });

  describe("logout", () => {
    it("calls authService.logout with the correct link", async () => {
      vi.mocked(linkDiscoveryService.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(authService.logout).mockResolvedValueOnce(undefined);

      const facade = createAuthService(mockApi, mockEntryLink);
      await facade.logout();

      expect(authService.logout).toHaveBeenCalledWith(mockApi, mockIdentityRoot.logout);
    });

    it("throws if identity root does not expose logout", async () => {
      vi.mocked(linkDiscoveryService.root).mockResolvedValueOnce({} as IdentityLinks);
      const facade = createAuthService(mockApi, mockEntryLink);

      await expect(facade.logout()).rejects.toThrow("Identity root does not expose a 'logout' link");
    });
  });

  describe("refreshToken", () => {
    it("calls authService.refreshToken with the correct link", async () => {
      vi.mocked(linkDiscoveryService.root).mockResolvedValueOnce(mockIdentityRoot);
      vi.mocked(authService.refreshToken).mockResolvedValueOnce(undefined);

      const facade = createAuthService(mockApi, mockEntryLink);
      await facade.refreshToken();

      expect(authService.refreshToken).toHaveBeenCalledWith(mockApi, mockIdentityRoot.refreshToken);
    });

    it("throws if identity root does not expose refresh", async () => {
      vi.mocked(linkDiscoveryService.root).mockResolvedValueOnce({} as IdentityLinks);
      const facade = createAuthService(mockApi, mockEntryLink);

      await expect(facade.refreshToken()).rejects.toThrow("Identity root does not expose a 'refresh' link");
    });
  });
});
