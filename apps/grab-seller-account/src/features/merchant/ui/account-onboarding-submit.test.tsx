// @vitest-environment jsdom

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import * as sellerUi from "@khinemyaezin/seller-ui";
import React from "react";
import AccountOnboardingSubmit from "./account-onboarding-submit";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@khinemyaezin/seller-ui", () => ({
  useApi: vi.fn(),
}));

describe("AccountOnboardingSubmit", () => {
  let queryClient: QueryClient;
  const mockApi = {
    followLink: vi.fn(),
  };

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    vi.clearAllMocks();
    vi.mocked(sellerUi.useApi).mockReturnValue(mockApi as any);
  });

  it("calls onSuccess when mutation resolves successfully", async () => {
    mockApi.followLink.mockResolvedValue({ status: "SUBMITTED" });
    const onSuccess = vi.fn();

    render(
      <AccountOnboardingSubmit link={{ href: "/api/merchant/submit" }} onSuccess={onSuccess} />,
      { wrapper: createWrapper() },
    );

    const submitBtn = screen.getByRole("button", { name: /submit application/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows an error toast with message when mutation fails and does not call onSuccess", async () => {
    mockApi.followLink.mockRejectedValue(new Error("Network timeout during submission"));
    const onSuccess = vi.fn();

    render(
      <AccountOnboardingSubmit link={{ href: "/api/merchant/submit" }} onSuccess={onSuccess} />,
      { wrapper: createWrapper() },
    );

    const submitBtn = screen.getByRole("button", { name: /submit application/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network timeout during submission");
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("disables the button while submission is pending", async () => {
    let resolveMutation!: (val: unknown) => void;
    mockApi.followLink.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMutation = resolve;
        }),
    );

    render(<AccountOnboardingSubmit link={{ href: "/api/merchant/submit" }} />, {
      wrapper: createWrapper(),
    });

    const submitBtn = screen.getByRole("button", { name: /submit application/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });

    resolveMutation({ status: "SUBMITTED" });

    await waitFor(() => {
      expect(submitBtn).toBeDisabled(); // remains disabled on success
    });
  });
});
