// @vitest-environment jsdom

import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ApiError,
  createHostEventBus,
  type HateoasLink,
  SellerApiLinks,
} from "@khinemyaezin/seller-api";
import * as sellerUi from "@khinemyaezin/seller-ui";
import React from "react";
import { useOnboardingFlow } from "./use-onboarding-flow";

vi.mock("@khinemyaezin/seller-ui", () => ({
  useApi: vi.fn(),
  usePlatform: vi.fn(),
}));

describe("useOnboardingFlow", () => {
  let queryClient: QueryClient;
  const mockApi = {
    followLink: vi.fn(),
  };
  const mockEvents = createHostEventBus();
  const mockSession = {
    refresh: vi.fn().mockResolvedValue(undefined),
    expire: vi.fn(),
    getSnapshot: vi.fn(),
    subscribe: vi.fn(),
    logout: vi.fn(),
  };
  const mockPlatform = {
    events: mockEvents,
    session: mockSession,
    config: { appName: "Test", apiBaseUrl: "/api" },
  };

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
    vi.mocked(sellerUi.useApi).mockReturnValue(mockApi as any);
    vi.mocked(sellerUi.usePlatform).mockReturnValue(mockPlatform as any);
  });

  it("derives account-registration step when API returns 404", async () => {
    const error404 = new ApiError(404, "Application not found", null);
    mockApi.followLink.mockRejectedValue(error404);

    const getLink: HateoasLink = { href: "/api/merchant/c2c-app" };
    const { result } = renderHook(
      () =>
        useOnboardingFlow({
          getApplicationLink: getLink,
          variant: "c2c",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.activeStepId).toBe("account-registration");
    });
  });

  it("derives profile-details step when completedBasicInfo is true", async () => {
    mockApi.followLink.mockResolvedValue({
      status: "DRAFT",
      completedBasicInfo: true,
      completedContactInfo: false,
      _links: {
        [SellerApiLinks.merchant.updateMerchantProfile]: {
          href: "/api/merchant/profile",
        },
      },
    });

    const getLink: HateoasLink = { href: "/api/merchant/c2c-app" };
    const { result } = renderHook(
      () =>
        useOnboardingFlow({
          getApplicationLink: getLink,
          variant: "c2c",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.activeStepId).toBe("profile-details");
    });
    expect(result.current.completeProfileLink?.href).toBe("/api/merchant/profile");
  });

  it("derives review step when completedContactInfo is true", async () => {
    mockApi.followLink.mockResolvedValue({
      status: "DRAFT",
      completedBasicInfo: true,
      completedContactInfo: true,
      _links: {
        [SellerApiLinks.merchantApplication.submitMerchantApplication]: {
          href: "/api/merchant/submit",
        },
      },
    });

    const getLink: HateoasLink = { href: "/api/merchant/c2c-app" };
    const { result } = renderHook(
      () =>
        useOnboardingFlow({
          getApplicationLink: getLink,
          variant: "c2c",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.activeStepId).toBe("review");
    });
    expect(result.current.submitApplicationLink?.href).toBe("/api/merchant/submit");
  });

  it("updates step immediately upon onBasicInfoSuccess and onProfileSuccess without timers", async () => {
    mockApi.followLink.mockRejectedValue(new ApiError(404, "Not found", null));

    const getLink: HateoasLink = { href: "/api/merchant/c2c-app" };
    const { result } = renderHook(
      () =>
        useOnboardingFlow({
          getApplicationLink: getLink,
          variant: "c2c",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.activeStepId).toBe("account-registration");
    });

    act(() => {
      result.current.onBasicInfoSuccess({
        [SellerApiLinks.merchant.updateMerchantProfile]: {
          href: "/api/merchant/profile-new",
        },
      });
    });

    expect(result.current.activeStepId).toBe("profile-details");
    expect(result.current.completeProfileLink?.href).toBe("/api/merchant/profile-new");

    act(() => {
      result.current.onProfileSuccess({
        [SellerApiLinks.merchantApplication.submitMerchantApplication]: {
          href: "/api/merchant/submit-new",
        },
      });
    });

    expect(result.current.activeStepId).toBe("review");
    expect(result.current.submitApplicationLink?.href).toBe("/api/merchant/submit-new");
  });

  it("submits successfully: refetches, refreshes session, emits event once, and calls onSuccess", async () => {
    mockApi.followLink.mockResolvedValue({
      status: "DRAFT",
      completedBasicInfo: true,
      completedContactInfo: true,
      _links: {},
    });

    const onSuccess = vi.fn();
    const eventListener = vi.fn();
    mockEvents.subscribe("seller-merchant:registration-success:v1", eventListener);

    const getLink: HateoasLink = { href: "/api/merchant/c2c-app" };
    const { result } = renderHook(
      () =>
        useOnboardingFlow({
          getApplicationLink: getLink,
          onSuccess,
          variant: "c2c",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.activeStepId).toBe("review");
    });

    await act(async () => {
      await result.current.onSubmitSuccess();
    });

    expect(mockSession.refresh).toHaveBeenCalledOnce();
    expect(eventListener).toHaveBeenCalledOnce();
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("resets override state when getApplicationLink changes", async () => {
    mockApi.followLink.mockRejectedValue(new ApiError(404, "Not found", null));

    let getLink: HateoasLink = { href: "/api/merchant/app-1" };
    const { result, rerender } = renderHook(
      () =>
        useOnboardingFlow({
          getApplicationLink: getLink,
          variant: "c2c",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.activeStepId).toBe("account-registration");
    });

    act(() => {
      result.current.onBasicInfoSuccess({
        [SellerApiLinks.merchant.updateMerchantProfile]: {
          href: "/api/merchant/profile-1",
        },
      });
    });

    expect(result.current.activeStepId).toBe("profile-details");

    // Change link
    getLink = { href: "/api/merchant/app-2" };
    rerender();

    await waitFor(() => {
      expect(result.current.activeStepId).toBe("account-registration");
    });
  });
});
