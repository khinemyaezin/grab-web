// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { RemoteBoundary } from "./RemoteBoundary";

describe("RemoteBoundary", () => {
  it("renders the remote component upon successful load", async () => {
    const MockRemote = () => <div>Remote Loaded Successfully</div>;
    const loader = vi.fn().mockResolvedValue({ default: MockRemote });

    render(<RemoteBoundary label="Test Remote" loader={loader} />);

    await waitFor(() => {
      expect(screen.getByText("Remote Loaded Successfully")).toBeInTheDocument();
    });
  });

  it("shows retry UI on remote load failure and retries when clicked", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const MockRemote = () => <div>Remote Recovered</div>;
    let callCount = 0;
    const loader = vi.fn().mockImplementation(() => {
      callCount += 1;
      if (callCount === 1) {
        return Promise.reject(new Error("Failed to fetch dynamically imported module"));
      }
      return Promise.resolve({ default: MockRemote });
    });

    render(<RemoteBoundary label="Fragile Remote" loader={loader} />);

    // Initially fails and shows fallback UI
    await waitFor(() => {
      expect(screen.getByText("Module unavailable")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });

    // Click retry
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Second attempt succeeds
    await waitFor(() => {
      expect(screen.getByText("Remote Recovered")).toBeInTheDocument();
    });

    expect(loader).toHaveBeenCalledTimes(2);
    consoleError.mockRestore();
  });
});
