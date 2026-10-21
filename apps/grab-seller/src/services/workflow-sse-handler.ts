import type { SseFrame } from "@khinemyaezin/seller-api";
import type { EventPayloads, PlatformEvents } from "@khinemyaezin/seller-contracts";
import { SseHandler } from "src/types/sse";

export type WorkflowUpdatedV1 = EventPayloads["workflow:updated:v1"] & {
  idempotencyKey?: string;
};

export class WorkflowEventStreamHandler implements SseHandler {
  handle(frame: SseFrame, events: PlatformEvents): boolean {
    if (frame.event !== "workflow") {
      return false;
    }

    const payload = this.parseWorkflowFrame(frame.data);
    if (payload) {
      events.emit("workflow:updated:v1", payload);
      return true;
    }

    return false;
  }

  parseWorkflowFrame(data: string): WorkflowUpdatedV1 | null {
    try {
      const parsed = JSON.parse(data) as Record<string, unknown>;
      if (
        typeof parsed.workflowId !== "string" ||
        typeof parsed.workflowName !== "string" ||
        typeof parsed.status !== "string"
      ) {
        return null;
      }
      return {
        producerId: typeof parsed.producerId === "string" ? parsed.producerId : "backend",
        workflowId: parsed.workflowId,
        workflowName: parsed.workflowName,
        status: parsed.status,
        idempotencyKey:
          typeof parsed.idempotencyKey === "string" ? parsed.idempotencyKey : undefined,
        errorMessage: typeof parsed.errorMessage === "string" ? parsed.errorMessage : undefined,
      };
    } catch {
      return null;
    }
  }
}
