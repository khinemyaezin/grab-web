import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import StorefrontEditPage from "./storefront-edit-page";

const mockGetLink = { href: "/api/v1/merchant/storefronts/{id}" };
let mockIsLoading = false;
let mockIsError = false;
let mockLinkAvailable = true;

vi.mock("@/features/merchant/api/use-root", () => ({
  useRoot: () => ({
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
  useMerchantLink: (rel: string) => (rel === "getStorefront" && mockLinkAvailable ? mockGetLink : undefined),
}));

vi.mock("@khinemyaezin/seller-ui", () => ({
  usePlatform: () => ({ events: { emit: vi.fn() } }),
  useShellBreadcrumb: vi.fn(),
}));

vi.mock("./use-storefront-edit-events", () => ({
  useStorefrontEditEvents: () => ({
    title: "Storefront Details",
    handleEvent: vi.fn(),
  }),
}));

vi.mock("./storefront-edit-view", () => ({
  StorefrontEditView: ({ storefrontId }: { storefrontId: string }) => (
    <div data-testid="storefront-edit-view">Edit View for {storefrontId}</div>
  ),
}));

describe("StorefrontEditPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoading = false;
    mockIsError = false;
    mockLinkAvailable = true;
  });

  it("renders edit view when storefrontId and capability link are present", () => {
    render(
      <MemoryRouter initialEntries={["/storefronts/sf-456"]}>
        <Routes>
          <Route path="/storefronts/:storefrontId" element={<StorefrontEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("storefront-edit-view")).toBeInTheDocument();
    expect(screen.getByText("Edit View for sf-456")).toBeInTheDocument();
  });

  it("renders fallback card when capability link is missing", () => {
    mockLinkAvailable = false;

    render(
      <MemoryRouter initialEntries={["/storefronts/sf-456"]}>
        <Routes>
          <Route path="/storefronts/:storefrontId" element={<StorefrontEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText("This storefront cannot be opened."),
    ).toBeInTheDocument();
  });
});
