import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { StorefrontNewForm } from "./storefront-new-form";

const mockSubmit = vi.fn();
let mockIsPending = false;
let mockIsSuccess = false;

vi.mock("./use-storefront-create-submit", () => ({
  useStorefrontCreateSubmit: ({ onLifecycleEvent }: { onLifecycleEvent?: (event: unknown) => void }) => ({
    submit: async () => {
      mockSubmit();
      onLifecycleEvent?.({ type: "created", storefrontId: "sf-123" });
    },
    isPending: mockIsPending,
    isSuccess: mockIsSuccess,
  }),
}));

const mockUseContextBar = vi.fn();

vi.mock("@khinemyaezin/seller-ui", () => ({
  useContextBar: (config: unknown) => mockUseContextBar(config),
  usePlatform: () => ({ events: { emit: vi.fn() } }),
}));

const mockLink: HateoasLink = { href: "/api/v1/merchant/storefronts" };

describe("StorefrontNewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPending = false;
    mockIsSuccess = false;
  });

  it("renders inputs and automatically suggests a slug based on the name", async () => {
    render(<StorefrontNewForm link={mockLink} />);

    const nameInput = screen.getByLabelText("Name");
    const slugInput = screen.getByLabelText("Slug");

    expect(nameInput).toBeInTheDocument();
    expect(slugInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "My Shop Outlet" } });

    expect(slugInput).toHaveValue("my-shop-outlet");
  });

  it("registers dirty state with useContextBar and calls submit on save", async () => {
    const onLifecycleEvent = vi.fn();
    render(<StorefrontNewForm link={mockLink} onLifecycleEvent={onLifecycleEvent} />);

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "Super Store" } });

    expect(mockUseContextBar).toHaveBeenCalled();
    const lastConfig = mockUseContextBar.mock.calls[mockUseContextBar.mock.calls.length - 1][0];
    expect(lastConfig.dirty).toBe(true);

    await lastConfig.onSave();
    expect(mockSubmit).toHaveBeenCalled();
  });
});
