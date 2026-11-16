import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StandaloneApp from "./StandaloneApp";

describe("grab-seller-pricing StandaloneApp smoke test", () => {
  it("renders StandaloneApp with createStandalonePlatform without crashing", () => {
    const { container } = render(<StandaloneApp />);
    expect(container).toBeTruthy();
  });
});
