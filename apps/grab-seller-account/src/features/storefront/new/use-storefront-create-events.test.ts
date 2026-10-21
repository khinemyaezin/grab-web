import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStorefrontCreateEvents } from "./use-storefront-create-events";

const mockEmit = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@khinemyaezin/seller-ui", () => ({
  usePlatform: () => ({
    events: { emit: mockEmit },
  }),
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("useStorefrontCreateEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("emits success toast and navigates back on created event", () => {
    const { result } = renderHook(() => useStorefrontCreateEvents());

    result.current.handleEvent({ type: "created", storefrontId: "sf-123" });

    expect(mockEmit).toHaveBeenCalledWith("shell:toast:v1", {
      type: "success",
      message: "Storefront created",
      position: "top-center",
    });
    expect(mockNavigate).toHaveBeenCalledWith("..");
  });

  it("emits custom success message on created event if provided", () => {
    const { result } = renderHook(() => useStorefrontCreateEvents());

    result.current.handleEvent({ type: "created", message: "Custom created message" });

    expect(mockEmit).toHaveBeenCalledWith("shell:toast:v1", {
      type: "success",
      message: "Custom created message",
      position: "top-center",
    });
  });

  it("emits error toast on createFailed event", () => {
    const { result } = renderHook(() => useStorefrontCreateEvents());

    result.current.handleEvent({ type: "createFailed", message: "Slug already exists" });

    expect(mockEmit).toHaveBeenCalledWith("shell:toast:v1", {
      type: "error",
      message: "Slug already exists",
      position: "top-center",
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
