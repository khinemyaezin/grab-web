import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { createHostEventBus } from "@khinemyaezin/seller-api";
import { PlatformProvider } from "../../context/platform-provider";
import { createMockPlatform } from "../../test/create-mock-platform";
import { ContextBar } from "./context-bar";

afterEach(cleanup);

describe("ContextBar", () => {
  it("renders nothing when there are no dirty entries", () => {
    const events = createHostEventBus();
    const platform = createMockPlatform({ events });

    const { queryByRole } = render(
      <PlatformProvider platform={platform}>
        <ContextBar />
      </PlatformProvider>,
    );

    expect(queryByRole("region")).toBeNull();
  });

  it("shows unsaved changes bar when a form becomes dirty", () => {
    const events = createHostEventBus();
    const platform = createMockPlatform({ events });

    const { getByRole, getByText } = render(
      <PlatformProvider platform={platform}>
        <ContextBar />
      </PlatformProvider>,
    );

    act(() => {
      events.emit("form:dirty:v1", {
        producerId: "test-form",
        groupId: "group-1",
        payload: { dirty: true, label: "Product details" },
      });
    });

    expect(getByRole("region")).toBeTruthy();
    expect(getByText(/Product details/)).toBeTruthy();
  });

  it("performs save with a unique producer ID, sets success, and emits shell:toast:v1 once", async () => {
    const events = createHostEventBus();
    const platform = createMockPlatform({ events });

    const toastListener = vi.fn();
    const saveListener = vi.fn();
    events.subscribe("shell:toast:v1", toastListener);
    events.subscribe("form:save:v1", saveListener);

    const { getByRole } = render(
      <PlatformProvider platform={platform}>
        <ContextBar />
      </PlatformProvider>,
    );

    act(() => {
      events.emit("form:dirty:v1", {
        producerId: "test-form",
        groupId: "group-1",
        payload: { dirty: true },
      });
    });

    const saveBtn = getByRole("button", { name: /save/i });
    fireEvent.click(saveBtn);

    expect(saveListener).toHaveBeenCalledOnce();
    const savePayload = saveListener.mock.calls[0][0];
    expect(savePayload.groupId).toBe("group-1");
    expect(savePayload.producerId).toMatch(/^context-bar-/);

    // Simulate form:saved:v1 response
    await act(async () => {
      events.emit("form:saved:v1", {
        producerId: "test-form",
        groupId: "group-1",
        status: "success",
      });
    });

    expect(toastListener).toHaveBeenCalledOnce();
    expect(toastListener).toHaveBeenCalledWith({
      type: "success",
      message: "All changes saved successfully",
    });
  });

  it("settles as failed and emits error toast once when a group fails", async () => {
    const events = createHostEventBus();
    const platform = createMockPlatform({ events });

    const toastListener = vi.fn();
    events.subscribe("shell:toast:v1", toastListener);

    const { getByRole } = render(
      <PlatformProvider platform={platform}>
        <ContextBar />
      </PlatformProvider>,
    );

    act(() => {
      events.emit("form:dirty:v1", {
        producerId: "test-form-1",
        groupId: "group-1",
        payload: { dirty: true },
      });
      events.emit("form:dirty:v1", {
        producerId: "test-form-2",
        groupId: "group-2",
        payload: { dirty: true },
      });
    });

    fireEvent.click(getByRole("button", { name: /save/i }));

    await act(async () => {
      events.emit("form:saved:v1", {
        producerId: "test-form-1",
        groupId: "group-1",
        status: "success",
      });
      events.emit("form:saved:v1", {
        producerId: "test-form-2",
        groupId: "group-2",
        status: "failed",
      });
    });

    expect(toastListener).toHaveBeenCalledOnce();
    expect(toastListener).toHaveBeenCalledWith({
      type: "error",
      message: "Failed to save changes",
    });
  });

  it("discards dirty groups with unique producerId", () => {
    const events = createHostEventBus();
    const platform = createMockPlatform({ events });

    const discardListener = vi.fn();
    events.subscribe("form:discard:v1", discardListener);

    const { getByRole } = render(
      <PlatformProvider platform={platform}>
        <ContextBar />
      </PlatformProvider>,
    );

    act(() => {
      events.emit("form:dirty:v1", {
        producerId: "test-form",
        groupId: "group-1",
        payload: { dirty: true },
      });
    });

    fireEvent.click(getByRole("button", { name: /discard/i }));

    expect(discardListener).toHaveBeenCalledOnce();
    expect(discardListener).toHaveBeenCalledWith({
      producerId: expect.stringMatching(/^context-bar-/),
      groupId: "group-1",
    });
  });

  it("aborts active save and cleans up timers on unmount", () => {
    const events = createHostEventBus();
    const platform = createMockPlatform({ events });

    const { getByRole, unmount } = render(
      <PlatformProvider platform={platform}>
        <ContextBar saveTimeoutMs={5000} />
      </PlatformProvider>,
    );

    act(() => {
      events.emit("form:dirty:v1", {
        producerId: "test-form",
        groupId: "group-1",
        payload: { dirty: true },
      });
    });

    fireEvent.click(getByRole("button", { name: /save/i }));

    // Unmount during save
    expect(() => unmount()).not.toThrow();
  });
});
