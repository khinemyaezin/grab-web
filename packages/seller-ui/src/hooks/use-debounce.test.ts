import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./use-debounce.js";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces callback execution until delay has elapsed", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 200));

    act(() => {
      result.current.debounceFn("first");
      result.current.debounceFn("second");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("cancels pending debounced execution on unmount", () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 200));

    act(() => {
      result.current.debounceFn("pending");
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("re-creates debounced function when delay changes", () => {
    const callback = vi.fn();
    let delay = 200;

    const { result, rerender } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current.debounceFn("run-200");
    });

    // Change delay to 500
    delay = 500;
    rerender();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Old timer was cancelled upon delay change
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      result.current.debounceFn("run-500");
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith("run-500");
  });

  it("supports manual cancel and flush", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current.debounceFn("test-flush");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      result.current.flush();
    });

    expect(callback).toHaveBeenCalledWith("test-flush");

    act(() => {
      result.current.debounceFn("test-cancel");
      result.current.cancel();
      vi.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
