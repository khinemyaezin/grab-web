import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PlatformProvider, usePlatform, useRequiredPlatform, useApi } from "./platform-provider";
import { createMockPlatform } from "../test/create-mock-platform";

describe("PlatformProvider", () => {
  it("usePlatform returns the same platform object in parent and child scopes", () => {
    const platform = createMockPlatform({
      config: { appName: "Parent App", apiBaseUrl: "/api/parent" },
    });

    let observedInParent: unknown;
    let observedInChild: unknown;

    function Child() {
      observedInChild = usePlatform();
      return <div>Child</div>;
    }

    function Parent() {
      observedInParent = usePlatform();
      return (
        <div>
          Parent
          <Child />
        </div>
      );
    }

    render(
      <PlatformProvider platform={platform}>
        <Parent />
      </PlatformProvider>,
    );

    expect(observedInParent).toBe(platform);
    expect(observedInChild).toBe(platform);
  });

  it("useRequiredPlatform throws a helpful error when used outside PlatformProvider", () => {
    function InvalidConsumer() {
      useRequiredPlatform();
      return null;
    }

    expect(() => render(<InvalidConsumer />)).toThrow(
      "useRequiredPlatform must be used within a PlatformProvider",
    );
  });

  it("useApi throws when platform.api is missing", () => {
    const platformWithoutApi = createMockPlatform({
      api: undefined as unknown as any,
    });

    function ApiConsumer() {
      useApi();
      return null;
    }

    expect(() =>
      render(
        <PlatformProvider platform={platformWithoutApi}>
          <ApiConsumer />
        </PlatformProvider>,
      ),
    ).toThrow("useApi must be used within a PlatformProvider supplying platform.api");
  });

  it("nested provider override works when explicitly provided and warns in development", () => {
    const parentPlatform = createMockPlatform({
      config: { appName: "Parent App", apiBaseUrl: "/api/parent" },
    });
    const childPlatform = createMockPlatform({
      config: { appName: "Child App", apiBaseUrl: "/api/child" },
    });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    let childObserved: unknown;

    function Child() {
      const p = useRequiredPlatform();
      childObserved = p;
      return <div data-testid="child">{p.config.appName}</div>;
    }

    render(
      <PlatformProvider platform={parentPlatform}>
        <PlatformProvider platform={childPlatform}>
          <Child />
        </PlatformProvider>
      </PlatformProvider>,
    );

    expect(childObserved).toBe(childPlatform);
    expect(screen.getByTestId("child").textContent).toBe("Child App");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Overriding existing parent platform"),
    );

    warnSpy.mockRestore();
  });
});
