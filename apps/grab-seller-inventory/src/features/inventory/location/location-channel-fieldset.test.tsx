import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LocationChannelFieldSet } from "./location-channel-fieldset";
import type { LocationResponse } from "@/features/inventory/types";

const linkMutate = vi.fn();
const unlinkMutate = vi.fn();

vi.mock("@/features/inventory/api/sales-channel-link", () => ({
  useSalesChannelLink: () => ({ href: "/api/v1/sales-channels" }),
}));

vi.mock("@/features/inventory/api/use-sales-channels", () => ({
  useSalesChannels: () => ({
    data: [
      { salesChannelId: "web-1", name: "Website", type: "WEBSITE", status: "ENABLED" },
      { salesChannelId: "mkt-1", name: "Marketplace", type: "MARKETPLACE", status: "ENABLED" },
    ],
  }),
}));

vi.mock("@/features/inventory/api/use-locations", () => ({
  useLinkLocationToChannelMutation: () => ({ mutateAsync: linkMutate, isPending: false }),
  useUnlinkLocationFromChannelMutation: () => ({ mutateAsync: unlinkMutate, isPending: false }),
}));

const location: LocationResponse = {
  id: "loc-1",
  code: "WH-001",
  name: "Warehouse",
  type: "WAREHOUSE",
  active: true,
  address: {
    line1: "1 Main",
    line2: "",
    city: "Yangon",
    state: "YGN",
    postalCode: "11181",
    country: "MM",
  },
  salesChannelIds: ["web-1"],
  _links: {
    "link-location-to-channel": { href: "/locations/loc-1/channels" },
    "unlink-location-from-channel": { href: "/locations/loc-1/channels/unlink" },
  },
};

describe("LocationChannelFieldSet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("checks channels already linked to the location", () => {
    render(<LocationChannelFieldSet location={location} />);
    expect(screen.getByLabelText("Website")).toBeChecked();
    expect(screen.getByLabelText("Marketplace")).not.toBeChecked();
  });

  it("links and unlinks from location HATEOAS relations", () => {
    render(<LocationChannelFieldSet location={location} />);
    fireEvent.click(screen.getByLabelText("Marketplace"));
    expect(linkMutate).toHaveBeenCalledWith({
      link: { href: "/locations/loc-1/channels" },
      salesChannelId: "mkt-1",
    });
    fireEvent.click(screen.getByLabelText("Website"));
    expect(unlinkMutate).toHaveBeenCalledWith({
      link: { href: "/locations/loc-1/channels/unlink" },
      salesChannelId: "web-1",
    });
  });
});
