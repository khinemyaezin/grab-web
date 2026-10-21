import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StorefrontLifecycleActions } from "./storefront-lifecycle-actions";

const mockActivateMutate = vi.fn();
const mockReactivateMutate = vi.fn();
const mockSuspendMutate = vi.fn();
const mockCloseMutate = vi.fn();

vi.mock("@/features/storefront/api/use-storefronts", () => ({
  useActivateStorefrontMutation: () => ({
    mutateAsync: mockActivateMutate,
    isPending: false,
  }),
  useReactivateStorefrontMutation: () => ({
    mutateAsync: mockReactivateMutate,
    isPending: false,
  }),
  useSuspendStorefrontMutation: () => ({
    mutateAsync: mockSuspendMutate,
    isPending: false,
  }),
  useCloseStorefrontMutation: () => ({
    mutateAsync: mockCloseMutate,
    isPending: false,
  }),
}));

describe("StorefrontLifecycleActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null when no action links are present", () => {
    const { container } = render(<StorefrontLifecycleActions />);
    expect(container.firstChild).toBeNull();
  });

  it("renders ellipsis dropdown trigger when action links are present", () => {
    render(
      <StorefrontLifecycleActions
        links={{
          "activate-storefront": { href: "/api/v1/merchant/storefronts/sf-1/activate" },
        }}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("opens dropdown and shows available actions", async () => {
    render(
      <StorefrontLifecycleActions
        links={{
          "activate-storefront": { href: "/api/v1/merchant/storefronts/sf-1/activate" },
          "close-storefront": { href: "/api/v1/merchant/storefronts/sf-1/close" },
        }}
      />,
    );

    const trigger = screen.getByRole("button");
    fireEvent.pointerDown(trigger, { pointerType: "mouse" });

    expect(await screen.findByRole("menuitem", { name: /activate/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /close/i })).toBeInTheDocument();
  });
});
