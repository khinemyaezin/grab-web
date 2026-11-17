import { describe, expect, it, vi } from "vitest";
import type { PlatformEvents } from "@khinemyaezin/seller-contracts";
import { WorkflowEventStreamHandler } from "./workflow-sse-handler";

function createMockEvents(): PlatformEvents {
  return {
    emit: vi.fn(),
    subscribe: vi.fn(),
    getState: vi.fn(),
    setState: vi.fn(),
    clear: vi.fn(),
  } as unknown as PlatformEvents;
}

describe("WorkflowEventStreamHandler", () => {
  it("parses valid workflow frames and emits workflow:updated:v1", () => {
    const handler = new WorkflowEventStreamHandler();
    const events = createMockEvents();

    const handled = handler.handle(
      {
        event: "workflow",
        data: JSON.stringify({
          workflowId: "wf-123",
          workflowName: "create-sellable-product",
          status: "COMPLETED",
          idempotencyKey: "idem-456",
        }),
      },
      events,
    );

    expect(handled).toBe(true);
    expect(events.emit).toHaveBeenCalledWith("workflow:updated:v1", {
      producerId: "backend",
      workflowId: "wf-123",
      workflowName: "create-sellable-product",
      status: "COMPLETED",
      idempotencyKey: "idem-456",
      errorMessage: undefined,
    });
  });

  it("handles optional producerId and errorMessage", () => {
    const handler = new WorkflowEventStreamHandler();
    const events = createMockEvents();

    const handled = handler.handle(
      {
        event: "workflow",
        data: JSON.stringify({
          producerId: "custom-worker",
          workflowId: "wf-999",
          workflowName: "update-sellable-product",
          status: "FAILED",
          errorMessage: "Database conflict",
        }),
      },
      events,
    );

    expect(handled).toBe(true);
    expect(events.emit).toHaveBeenCalledWith("workflow:updated:v1", {
      producerId: "custom-worker",
      workflowId: "wf-999",
      workflowName: "update-sellable-product",
      status: "FAILED",
      idempotencyKey: undefined,
      errorMessage: "Database conflict",
    });
  });

  it("ignores non-workflow frames and does not emit", () => {
    const handler = new WorkflowEventStreamHandler();
    const events = createMockEvents();

    const handledReady = handler.handle(
      {
        event: "ready",
        data: JSON.stringify({ producerId: "backend" }),
      },
      events,
    );
    expect(handledReady).toBe(false);

    const handledComment = handler.handle(
      {
        data: "ping",
      },
      events,
    );
    expect(handledComment).toBe(false);

    expect(events.emit).not.toHaveBeenCalled();
  });

  it("rejects invalid or malformed workflow payloads", () => {
    const handler = new WorkflowEventStreamHandler();
    const events = createMockEvents();

    // Malformed JSON
    expect(
      handler.handle(
        {
          event: "workflow",
          data: "{ invalid json",
        },
        events,
      ),
    ).toBe(false);

    // Missing workflowId
    expect(
      handler.handle(
        {
          event: "workflow",
          data: JSON.stringify({ workflowName: "wf", status: "COMPLETED" }),
        },
        events,
      ),
    ).toBe(false);

    // Missing workflowName
    expect(
      handler.handle(
        {
          event: "workflow",
          data: JSON.stringify({ workflowId: "wf-1", status: "COMPLETED" }),
        },
        events,
      ),
    ).toBe(false);

    // Missing status
    expect(
      handler.handle(
        {
          event: "workflow",
          data: JSON.stringify({ workflowId: "wf-1", workflowName: "test" }),
        },
        events,
      ),
    ).toBe(false);

    expect(events.emit).not.toHaveBeenCalled();
  });
});
