import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { ApiError, type HateoasLink } from "@khinemyaezin/seller-api";
import { useStorefrontCreateSubmit } from "./use-storefront-create-submit";

const mockMutateAsync = vi.fn();
const mockGetValues = vi.fn();

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: mockGetValues,
  }),
}));

vi.mock("@/features/storefront/api/use-storefronts", () => ({
  useCreateStorefrontMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isSuccess: false,
  }),
}));

const mockLink: HateoasLink = { href: "/api/v1/merchant/storefronts" };

describe("useStorefrontCreateSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits payload and emits created event on success", async () => {
    mockGetValues.mockReturnValue({
      name: " Boutique Shop ",
      slug: " boutique-shop ",
    });
    mockMutateAsync.mockResolvedValue({
      storefrontId: "sf-999",
      name: "Boutique Shop",
      slug: "boutique-shop",
    });

    const onLifecycleEvent = vi.fn();
    const { result } = renderHook(() =>
      useStorefrontCreateSubmit({ link: mockLink, onLifecycleEvent }),
    );

    await result.current.submit();

    expect(mockMutateAsync).toHaveBeenCalledWith({
      link: mockLink,
      request: {
        name: "Boutique Shop",
        slug: "boutique-shop",
      },
    });
    expect(onLifecycleEvent).toHaveBeenCalledWith({
      type: "created",
      storefrontId: "sf-999",
    });
  });

  it("emits createFailed and rethrows on error", async () => {
    mockGetValues.mockReturnValue({
      name: "Duplicate",
      slug: "duplicate",
    });
    const error = new ApiError(400, "Bad Request", { detail: "Slug already taken" });
    mockMutateAsync.mockRejectedValue(error);

    const onLifecycleEvent = vi.fn();
    const { result } = renderHook(() =>
      useStorefrontCreateSubmit({ link: mockLink, onLifecycleEvent }),
    );

    await expect(result.current.submit()).rejects.toThrow();

    expect(onLifecycleEvent).toHaveBeenCalledWith({
      type: "createFailed",
      message: "Slug already taken",
    });
  });
});
