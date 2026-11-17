// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@khinemyaezin/seller-api";
import * as sellerUi from "@khinemyaezin/seller-ui";
import React from "react";
import { MemoryRouter } from "react-router";
import C2cAccountOnboardingView from "./c2c-onboarding-view";

vi.mock("@khinemyaezin/seller-ui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@khinemyaezin/seller-ui")>();
  return {
    ...actual,
    useApi: vi.fn(),
    usePlatform: vi.fn(),
  };
});

vi.mock("@/features/merchant/api/use-root", () => ({
  useRoot: () => ({
    data: {
      listRegionCountries: { href: "/api/region/countries" },
    },
  }),
}));

describe("C2cAccountOnboardingView", () => {
  let queryClient: QueryClient;
  const mockApi = {
    followLink: vi.fn(),
  };

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
    vi.mocked(sellerUi.useApi).mockReturnValue(mockApi as any);
    vi.mocked(sellerUi.usePlatform).mockReturnValue({
      events: { emit: vi.fn(), subscribe: vi.fn() },
      session: { refresh: vi.fn() },
    } as any);
  });

  it("renders Account Registration step when application is 404", async () => {
    mockApi.followLink.mockRejectedValue(new ApiError(404, "Not found", null));

    render(
      <C2cAccountOnboardingView
        createApplicationLink={{ href: "/api/merchant/c2c" }}
        getApplicationLink={{ href: "/api/merchant/c2c/status" }}
      />,
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Account Registration" })).toBeInTheDocument();
    });
  });

  it("renders status view when application status is not DRAFT", async () => {
    mockApi.followLink.mockResolvedValue({
      status: "UNDER_REVIEW",
      type: "INDIVIDUAL",
      completedBasicInfo: true,
      completedContactInfo: true,
      _links: {},
    });

    render(
      <C2cAccountOnboardingView
        createApplicationLink={{ href: "/api/merchant/c2c" }}
        getApplicationLink={{ href: "/api/merchant/c2c/status" }}
      />,
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText(/Application under review/i)).toBeInTheDocument();
    });
  });
});
