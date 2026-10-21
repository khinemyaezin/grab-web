import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import StorefrontNewPage from "./storefront-new-page";

const mockCreateLink = { href: "/api/v1/merchant/storefronts" };
let mockIsLoading = false;
let mockIsError = false;
let mockLinkAvailable = true;

vi.mock("@/features/merchant/api/use-root", () => ({
  useRoot: () => ({
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
  useMerchantLink: (rel: string) => (rel === "createStorefront" && mockLinkAvailable ? mockCreateLink : undefined),
}));

vi.mock("@khinemyaezin/seller-ui", () => ({
  usePlatform: () => ({
    events: { emit: vi.fn(), subscribe: () => () => {} },
  }),
  useShellBreadcrumb: vi.fn(),
  useContextBar: vi.fn(),
}));

vi.mock("./use-storefront-create-events", () => ({
  useStorefrontCreateEvents: () => ({
    handleEvent: vi.fn(),
    toast: vi.fn(),
  }),
}));

vi.mock("./storefront-new-form", () => ({
  StorefrontNewForm: () => <div data-testid="storefront-new-form">Mock Form</div>,
}));

describe("StorefrontNewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoading = false;
    mockIsError = false;
    mockLinkAvailable = true;
  });

  it("renders page header and form when create capability link is available", () => {
    render(
      <MemoryRouter>
        <StorefrontNewPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Add Storefront" })).toBeInTheDocument();
    expect(screen.getByTestId("storefront-new-form")).toBeInTheDocument();
  });

  it("renders fallback card when create link is not available", () => {
    mockLinkAvailable = false;

    render(
      <MemoryRouter>
        <StorefrontNewPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Storefront creation is not available."),
    ).toBeInTheDocument();
  });
});
