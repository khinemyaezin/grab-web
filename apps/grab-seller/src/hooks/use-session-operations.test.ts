import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  IdentityProfile,
  IdentityService,
  PlatformEvents,
  SessionSnapshot,
} from "@khinemyaezin/seller-contracts";
import { useSessionOperations } from "./use-session-operations";

const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("useSessionOperations", () => {
  let mockIdentityService: IdentityService;
  let mockEvents: PlatformEvents;
  let snapshotRef: { current: SessionSnapshot };
  let publishSnapshot: ReturnType<typeof vi.fn<(next: SessionSnapshot) => void>>;
  let onSessionCleared: ReturnType<typeof vi.fn<() => void>>;

  const sampleProfile: IdentityProfile = {
    id: "user-1",
    email: "seller@grab.com",
    name: "Seller One",
    avatar: "https://avatar.test/pic.png",
    roles: ["SELLER"],
    permissions: ["orders:read"],
    accessContexts: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    snapshotRef = {
      current: {
        status: "authenticated",
        user: {
          id: "user-1",
          email: "seller@grab.com",
          name: "Seller One",
          accessContexts: [],
        },
        roles: ["SELLER"],
        permissions: ["orders:read"],
      },
    };
    publishSnapshot = vi.fn((next) => {
      snapshotRef.current = next;
    });
    onSessionCleared = vi.fn();
    mockEvents = {
      emit: vi.fn(),
      subscribe: vi.fn(),
      clear: vi.fn(),
    } as unknown as PlatformEvents;

    mockIdentityService = {
      getProfile: vi.fn().mockResolvedValue(sampleProfile),
      login: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
    };
  });

  describe("refresh", () => {
    it("revalidates the OIDC session by reading the profile", async () => {
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await act(async () => {
        await result.current.refresh();
      });

      expect(mockIdentityService.getProfile).toHaveBeenCalledTimes(1);
      expect(publishSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({ status: "authenticated" }),
      );
      expect(mockEvents.emit).toHaveBeenCalledWith("auth:session-refreshed:v1", {});
    });

    it("shares a single in-flight promise across concurrent refresh calls", async () => {
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await act(async () => {
        await Promise.all([result.current.refresh(), result.current.refresh()]);
      });

      expect(mockIdentityService.getProfile).toHaveBeenCalledTimes(1);
    });

    it("expires the session when profile revalidation rejects with 401", async () => {
      vi.mocked(mockIdentityService.getProfile).mockRejectedValueOnce({ status: 401 });

      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await expect(result.current.refresh()).rejects.toEqual({ status: 401 });

      expect(publishSnapshot).toHaveBeenCalledWith({ status: "anonymous" });
      expect(onSessionCleared).toHaveBeenCalled();
      expect(mockEvents.emit).toHaveBeenCalledWith("auth:session-expired:v1", {
        reason: "unauthorized",
      });
    });

    it("preserves the session when profile revalidation returns 403", async () => {
      vi.mocked(mockIdentityService.getProfile).mockRejectedValueOnce({ status: 403 });
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await expect(result.current.refresh()).rejects.toMatchObject({ status: 403 });
      expect(publishSnapshot).not.toHaveBeenCalledWith({ status: "anonymous" });
      expect(onSessionCleared).not.toHaveBeenCalled();
    });

    it("does not expire session when refresh rejects with a network error", async () => {
      const netError = new TypeError("Failed to fetch");
      vi.mocked(mockIdentityService.getProfile).mockRejectedValueOnce(netError);

      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await expect(result.current.refresh()).rejects.toThrow("Failed to fetch");

      expect(publishSnapshot).not.toHaveBeenCalledWith({ status: "anonymous" });
      expect(onSessionCleared).not.toHaveBeenCalled();
      expect(mockEvents.emit).not.toHaveBeenCalledWith(
        "auth:session-expired:v1",
        expect.anything(),
      );
    });
  });

  describe("login", () => {
    it("starts the browser login flow via authService", async () => {
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await act(async () => {
        await result.current.login();
      });

      expect(mockIdentityService.login).toHaveBeenCalledTimes(1);
    });

    it("throws if authService is not available", async () => {
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: null,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await expect(result.current.login()).rejects.toThrow("Identity module link is not available");
    });
  });

  describe("logout", () => {
    it("starts the browser logout flow", async () => {
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await act(async () => {
        await result.current.logout();
      });

      expect(mockIdentityService.logout).toHaveBeenCalledTimes(1);
      expect(publishSnapshot).not.toHaveBeenCalled();
      expect(onSessionCleared).not.toHaveBeenCalled();
      expect(mockEvents.emit).not.toHaveBeenCalledWith("auth:logout:v1", {});
    });
  });

  describe("expireSession", () => {
    it("is idempotent and does nothing if session is already anonymous", () => {
      snapshotRef.current = { status: "anonymous" };

      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      act(() => {
        result.current.expireSession("manual");
      });

      expect(publishSnapshot).not.toHaveBeenCalled();
      expect(mockEvents.emit).not.toHaveBeenCalled();
    });
  });

  describe("loadSession", () => {
    it("fetches profile, transforms to snapshot, and publishes authenticated state", async () => {
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      let loaded: SessionSnapshot | undefined;
      await act(async () => {
        loaded = await result.current.loadSession();
      });

      expect(mockIdentityService.getProfile).toHaveBeenCalledTimes(1);
      expect(loaded?.status).toBe("authenticated");
      expect(publishSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({ status: "authenticated" }),
      );
    });

    it("publishes anonymous snapshot when receiving 401", async () => {
      vi.mocked(mockIdentityService.getProfile).mockRejectedValueOnce({ status: 401 });

      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      let loaded: SessionSnapshot | undefined;
      await act(async () => {
        loaded = await result.current.loadSession();
      });

      expect(loaded?.status).toBe("anonymous");
      expect(publishSnapshot).toHaveBeenCalledWith({ status: "anonymous" });
    });

    it("retries on transient error and succeeds without logging out", async () => {
      vi.mocked(mockIdentityService.getProfile)
        .mockRejectedValueOnce(new TypeError("Failed to fetch"))
        .mockResolvedValueOnce(sampleProfile);

      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
          retryDelayMs: 5,
        }),
      );

      let loaded: SessionSnapshot | undefined;
      await act(async () => {
        loaded = await result.current.loadSession();
      });

      expect(mockIdentityService.getProfile).toHaveBeenCalledTimes(2);
      expect(loaded?.status).toBe("authenticated");
      expect(publishSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({ status: "authenticated" }),
      );
    });

    it("deduplicates concurrent in-flight loadSession calls", async () => {
      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await act(async () => {
        const [res1, res2] = await Promise.all([
          result.current.loadSession(),
          result.current.loadSession(),
        ]);
        expect(res1).toEqual(res2);
      });

      expect(mockIdentityService.getProfile).toHaveBeenCalledTimes(1);
    });

    it("does not publish snapshot when aborted", async () => {
      const controller = new AbortController();
      controller.abort();

      const { result } = renderHook(() =>
        useSessionOperations({
          authService: mockIdentityService,
          publishSnapshot,
          snapshotRef,
          onSessionCleared,
          events: mockEvents,
        }),
      );

      await act(async () => {
        await result.current.loadSession(controller.signal);
      });

      expect(publishSnapshot).not.toHaveBeenCalled();
    });
  });
});
