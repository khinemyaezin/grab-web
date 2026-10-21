import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import StorefrontListPage from "./storefront-list-page";

const mockListLink = { href: "/api/v1/merchant/storefronts" };
const mockCreateLink = { href: "/api/v1/merchant/storefronts/new" };
let mockIsLoading = false;
let mockIsError = false;
let mockHasListLink = true;

vi.mock("@/features/merchant/api/use-root", () => ({
  useRoot: () => ({
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
  useMerchantLink: (rel: string) => {
    if (rel === "listStorefronts" && mockHasListLink) return mockListLink;
    if (rel === "createStorefront") return mockCreateLink;
    return undefined;
  },
}));

vi.mock("@khinemyaezin/seller-ui", () => ({
  usePlatform: () => ({ events: { emit: vi.fn() } }),
  useShellBreadcrumb: vi.fn(),
}));

vi.mock("./storefronts-view", () => ({
  StorefrontsView: ({ canCreate }: { canCreate?: boolean }) => (
    <div data-testid="storefronts-view">
      Storefronts View Content {canCreate ? "(Can Create)" : "(Cannot Create)"}
    </div>
  ),
}));

describe("StorefrontListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoading = false;
    mockIsError = false;
    mockHasListLink = true;
  });

  it("renders header and StorefrontsView when list capability link is available", () => {
    render(
      <MemoryRouter>
        <StorefrontListPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Storefronts" })).toBeInTheDocument();
    expect(screen.getByTestId("storefronts-view")).toBeInTheDocument();
    expect(screen.getByText(/Can Create/i)).toBeInTheDocument();
  });

  it("renders fallback card when list link is unavailable", () => {
    mockHasListLink = false;

    render(
      <MemoryRouter>
        <StorefrontListPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Storefront management is not available for this account."),
    ).toBeInTheDocument();
  });
});
