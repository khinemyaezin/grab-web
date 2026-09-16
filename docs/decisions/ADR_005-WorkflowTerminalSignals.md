# Workflow Terminal Signals

## Status

Accepted (implemented)

**Does not supersede:** [ADR_004](./ADR_004-HostOwnedBackendEventStream.md). The host still owns the socket. This ADR adds the first domain mapping onto `platform.events`.

**Does not supersede:** [ADR_003](./ADR_003-HostMediatedSessionDurableEventBus.md). Workflow completion is a **signal** (`emit`), not `setState`. REST remains the source of truth.

**Related (backend):** `grab` ADR_009 — Workflow terminal UI notifications.

---

## 1. The Problem

ADR_004 only maps stream lifecycle (`ready` / disconnected). The product MFE still toasts “Product create started” on HTTP 202 and never learns `COMPLETED` / `FAILED` / `COMPENSATED`. Fast workflows can emit the terminal SSE frame before the 202 returns `workflowId`, so a post-response subscribe races.

---

## 2. What We Decided

The host maps named SSE event `workflow` onto `workflow:updated:v1`. The envelope is **workflow-shaped only**. Entity identity (`productId`) does not belong here; it lives on a later `resource` event (peer refresh), not the actor awaiter.

**Topics (signals):**

- `stream:ready:v1` / `stream:disconnected:v1` — transport (ADR_004)
- `workflow:updated:v1` — `{ producerId, workflowId, workflowName, status, idempotencyKey?, errorMessage? }`

**Correlation:** the client generates `idempotencyKey` (`crypto.randomUUID()`) inside `awaitWorkflow` *before* POST, sends it on the start request, and matches `workflowName` + `idempotencyKey`. Do not subscribe by `workflowId` after 202. Do not use `productId` as a fake correlation key.

**Product MFE:** create and update share one subscribe-before wrap:

```ts
await awaitWorkflow((idempotencyKey) =>
  mutateAsync({
    link,
    request: { ...payload, idempotencyKey },
  }),
);
```

`useWorkflowAwaiter` subscribes to `workflow:updated:v1` with `{ replay: false }` before the trigger runs, and buffers one matching terminal frame that arrives during the POST.

| Status | UI |
|--------|----|
| `COMPLETED` | success toast; invalidate product queries |
| `FAILED` / `COMPENSATED` | error toast (`errorMessage` or generic copy) |
| timeout | info/error toast that the workflow is still running |

Remotes never import `readBackendEventStream`. Heartbeat comments stay off the bus. No `Last-Event-ID` replay; reconnect gaps are accepted until REST refetch.

---

## 3. Why This Approach

1. Host mapping keeps transport out of remotes.
2. The idempotency key is known before HTTP returns, so create and update share one awaiter and do not miss early SSE frames.
3. Signal (not last-value cache) matches one-shot terminal notifications.
4. Keeping entity identity off this envelope leaves peer refresh to a dedicated `resource` event.

---

## 4. Related Documents

- [ADR_004 — Host-owned backend event stream](./ADR_004-HostOwnedBackendEventStream.md)
- [ADR_003 — Host-mediated session-durable event bus](./ADR_003-HostMediatedSessionDurableEventBus.md)
- Backend ADR_008 and ADR_009 (`grab` repo `docs/system/`)
