import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { ApiError, type HateoasLink } from "@khinemyaezin/seller-api";
import { useStorefrontUpdateSubmit } from "./use-storefront-update-submit";

const mockMutateAsync = vi.fn();
const mockGetValues = vi.fn();

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: mockGetValues,
  }),
}));

vi.mock("@/features/storefront/api/use-storefronts", () => ({
  useUpdateStorefrontMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isSuccess: false,
  }),
}));

const mockUpdateLink: HateoasLink = { href: "/api/v1/merchant/storefronts/sf-123" };

describe("useStorefrontUpdateSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits update payload and emits updated event on success", async () => {
    mockGetValues.mockReturnValue({
      name: " Updated Store ",
      slug: " updated-store ",
    });
    mockMutateAsync.mockResolvedValue({});

    const onLifecycleEvent = vi.fn();
    const { result } = renderHook(() =>
      useStorefrontUpdateSubmit({ updateLink: mockUpdateLink, onLifecycleEvent }),
    );

    await result.current.submit();

    expect(mockMutateAsync).toHaveBeenCalledWith({
      link: mockUpdateLink,
      request: {
        name: "Updated Store",
        slug: "updated-store",
      },
    });
    expect(onLifecycleEvent).toHaveBeenCalledWith({ type: "updated" });
  });

  it("does not mutate if updateLink is not provided", async () => {
    const onLifecycleEvent = vi.fn();
    const { result } = renderHook(() =>
      useStorefrontUpdateSubmit({ updateLink: undefined, onLifecycleEvent }),
    );

    await result.current.submit();

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(onLifecycleEvent).not.toHaveBeenCalled();
  });

  it("emits updateFailed and rethrows on error", async () => {
    mockGetValues.mockReturnValue({
      name: "Updated Store",
      slug: "updated-store",
    });
    const error = new ApiError(400, "Bad Request", { detail: "Failed to update profile" });
    mockMutateAsync.mockRejectedValue(error);

    const onLifecycleEvent = vi.fn();
    const { result } = renderHook(() =>
      useStorefrontUpdateSubmit({ updateLink: mockUpdateLink, onLifecycleEvent }),
    );

    await expect(result.current.submit()).rejects.toThrow();

    expect(onLifecycleEvent).toHaveBeenCalledWith({
      type: "updateFailed",
      message: "Failed to update profile",
    });
  });
});
