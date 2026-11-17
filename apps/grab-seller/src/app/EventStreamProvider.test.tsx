import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, act } from "@testing-library/react";
import type { SellerPlatform, SessionSnapshot } from "@khinemyaezin/seller-contracts";
import { createHostEventBus } from "@khinemyaezin/seller-api";
import { EventStreamProvider, useEventStreamState } from "./EventStreamProvider";

const mockCreateBackendEventStream = vi.fn();
vi.mock("@khinemyaezin/seller-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@khinemyaezin/seller-api")>();
  return {
    ...actual,
    createBackendEventStream: (options: unknown) => mockCreateBackendEventStream(options),
  };
});

let mockPlatform: SellerPlatform;
let mockSnapshot: SessionSnapshot;

vi.mock("@khinemyaezin/seller-ui", () => ({
  usePlatform: () => mockPlatform,
  useSessionSnapshot: () => mockSnapshot,
}));

vi.mock("../hooks/use-entry", () => ({
  useEntryGet: () => ({
    data: {
      _links: {
        "event-stream": {
          href: "http://api.test/events/stream",
        },
      },
    },
    isFetched: true,
  }),
}));

function Consumer() {
  const { status, lastEventId } = useEventStreamState();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="lastEventId">{lastEventId ?? "none"}</span>
    </div>
  );
}

describe("EventStreamProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSnapshot = {
      status: "authenticated",
      user: {
        id: "usr-1",
        email: "user@grab.com",
        name: "Test User",
        currentAccessContext: {
          assignmentId: "asg-1",
          scopeId: "scope-1",
          platformCode: "SELLER_PORTAL",
          roleCode: "ADMIN",
          scopeKey: "MERCHANT",
          status: "ACTIVE",
        },
        accessContexts: [],
      },
      roles: ["SELLER"],
      permissions: ["*"],
    };

    mockPlatform = {
      version: "1.0.0",
      config: {
        appName: "Test Shell",
        apiBaseUrl: "/api",
      },
      session: {
        getSnapshot: () => mockSnapshot,
        subscribe: () => () => {},
        refresh: vi.fn(),
        expire: vi.fn(),
        logout: vi.fn(),
      },
      events: createHostEventBus(),
      navigation: { navigate: vi.fn() },
      api: {} as any,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("establishes one SSE connection when authenticated", () => {
    render(
      <EventStreamProvider>
        <Consumer />
      </EventStreamProvider>,
    );

    expect(mockCreateBackendEventStream).toHaveBeenCalledOnce();
    const options = mockCreateBackendEventStream.mock.calls[0][0];
    expect(options.url).toBe("http://api.test/events/stream");
    expect(options.storageKey).toBe("sse:last-event-id:scope-1");
  });

  it("does not connect when session is anonymous", () => {
    mockSnapshot = { status: "anonymous" };

    const { getByTestId } = render(
      <EventStreamProvider>
        <Consumer />
      </EventStreamProvider>,
    );

    expect(mockCreateBackendEventStream).not.toHaveBeenCalled();
    expect(getByTestId("status").textContent).toBe("idle");
  });

  it("aborts the connection and emits logout reason on logout", () => {
    const disconnectedListener = vi.fn();
    mockPlatform.events.subscribe("stream:disconnected:v1", disconnectedListener);

    let capturedSignal: AbortSignal | undefined;
    mockCreateBackendEventStream.mockImplementation(({ signal }) => {
      capturedSignal = signal;
      return new Promise(() => {});
    });

    const { unmount } = render(
      <EventStreamProvider>
        <Consumer />
      </EventStreamProvider>,
    );

    expect(capturedSignal?.aborted).toBe(false);

    // Transition session to anonymous before unmounting (simulating logout)
    mockSnapshot = { status: "anonymous" };

    unmount();

    expect(capturedSignal?.aborted).toBe(true);
    expect(disconnectedListener).toHaveBeenCalledWith({
      producerId: "host",
      reason: "logout",
    });
  });

  it("reconnects with context-change reason when access context changes", () => {
    const disconnectedListener = vi.fn();
    mockPlatform.events.subscribe("stream:disconnected:v1", disconnectedListener);

    let signals: AbortSignal[] = [];
    mockCreateBackendEventStream.mockImplementation(({ signal }) => {
      signals.push(signal);
      return new Promise(() => {});
    });

    const { rerender } = render(
      <EventStreamProvider>
        <Consumer />
      </EventStreamProvider>,
    );

    expect(mockCreateBackendEventStream).toHaveBeenCalledTimes(1);

    // Switch access context scope
    act(() => {
      if (mockSnapshot.status === "authenticated") {
        mockSnapshot = {
          ...mockSnapshot,
          user: {
            ...mockSnapshot.user,
            currentAccessContext: {
              assignmentId: "asg-2",
              scopeId: "scope-2",
              platformCode: "SELLER_PORTAL",
              roleCode: "ADMIN",
              scopeKey: "MERCHANT",
              status: "ACTIVE",
            },
          },
        };
      }
    });

    rerender(
      <EventStreamProvider>
        <Consumer />
      </EventStreamProvider>,
    );

    expect(mockCreateBackendEventStream).toHaveBeenCalledTimes(2);
    expect(signals[0].aborted).toBe(true);
    expect(disconnectedListener).toHaveBeenCalledWith({
      producerId: "host",
      reason: "context-change",
    });
    expect(mockCreateBackendEventStream.mock.calls[1][0].storageKey).toBe(
      "sse:last-event-id:scope-2",
    );
  });

  it("does not create duplicate connections under React StrictMode", () => {
    render(
      <StrictMode>
        <EventStreamProvider>
          <Consumer />
        </EventStreamProvider>
      </StrictMode>,
    );

    // In StrictMode, first mount unmounts and remounts once, resulting in 1 active connection
    const calls = mockCreateBackendEventStream.mock.calls;
    expect(calls.length).toBeGreaterThanOrEqual(1);
    const lastCall = calls[calls.length - 1][0];
    expect(lastCall.signal.aborted).toBe(false);
  });

  it("does not reconnect on simple route re-renders without scope changes", () => {
    const { rerender } = render(
      <EventStreamProvider>
        <Consumer />
      </EventStreamProvider>,
    );

    expect(mockCreateBackendEventStream).toHaveBeenCalledTimes(1);

    rerender(
      <EventStreamProvider>
        <div>Other route view</div>
      </EventStreamProvider>,
    );

    expect(mockCreateBackendEventStream).toHaveBeenCalledTimes(1);
  });
});
