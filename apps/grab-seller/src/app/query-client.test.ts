import { describe, it, expect } from "vitest";
import { ApiError } from "@khinemyaezin/seller-api";
import { createShellQueryClient } from "./query-client";

describe("createShellQueryClient", () => {
  it("configures query defaults properly", () => {
    const client = createShellQueryClient();
    const defaultOptions = client.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toBe(30_000);
    const retryFn = defaultOptions.queries?.retry as (
      failureCount: number,
      error: unknown,
    ) => boolean;

    expect(typeof retryFn).toBe("function");

    // 4xx errors should not be retried
    const notFoundError = new ApiError(404, "Not Found", null);
    expect(retryFn(0, notFoundError)).toBe(false);

    const badRequestError = new ApiError(400, "Bad Request", null);
    expect(retryFn(0, badRequestError)).toBe(false);

    const object403 = { status: 403, message: "Forbidden" };
    expect(retryFn(0, object403)).toBe(false);

    // 5xx and network errors should retry up to 2 times
    const serverError = new ApiError(500, "Internal Server Error", null);
    expect(retryFn(0, serverError)).toBe(true);
    expect(retryFn(1, serverError)).toBe(true);
    expect(retryFn(2, serverError)).toBe(false);

    const networkError = new TypeError("Failed to fetch");
    expect(retryFn(0, networkError)).toBe(true);
    expect(retryFn(1, networkError)).toBe(true);
    expect(retryFn(2, networkError)).toBe(false);
  });
});
