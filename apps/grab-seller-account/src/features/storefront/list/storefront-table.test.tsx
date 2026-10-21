import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { StorefrontTable } from "./storefront-table";

let mockStorefrontsData: unknown = undefined;
let mockIsLoading = false;
let mockIsError = false;

vi.mock("@/features/storefront/api/use-storefronts", () => ({
  useStorefronts: () => ({
    data: mockStorefrontsData,
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
}));

const mockLink: HateoasLink = { href: "/api/v1/merchant/storefronts" };

describe("StorefrontTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorefrontsData = undefined;
    mockIsLoading = false;
    mockIsError = false;
  });

  it("renders empty state when no storefronts exist", () => {
    mockStorefrontsData = {
      _embedded: { storefrontResponseList: [] },
    };

    render(
      <MemoryRouter>
        <StorefrontTable link={mockLink} />
      </MemoryRouter>,
    );

    expect(screen.getByText("No storefronts yet")).toBeInTheDocument();
  });

  it("renders list of storefronts with status badges", () => {
    mockStorefrontsData = {
      _embedded: {
        storefrontResponseList: [
          {
            storefrontId: "sf-1",
            merchantId: "m-1",
            name: "Downtown Store",
            slug: "downtown-store",
            status: "ACTIVE",
            _links: { self: { href: "/api/v1/merchant/storefronts/sf-1" } },
          },
          {
            storefrontId: "sf-2",
            merchantId: "m-1",
            name: "Uptown Store",
            slug: "uptown-store",
            status: "DRAFT",
          },
        ],
      },
    };

    render(
      <MemoryRouter>
        <StorefrontTable link={mockLink} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Downtown Store")).toBeInTheDocument();
    expect(screen.getByText("Uptown Store")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    expect(screen.getByText("DRAFT")).toBeInTheDocument();
  });
});
