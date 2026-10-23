import type { EventPayloads } from "@khinemyaezin/seller-contracts";
export type WorkflowUpdatedV1 = EventPayloads["workflow:updated:v1"] & {
    idempotencyKey?: string;
};
export declare class WorkflowTimeoutError extends Error {
    constructor(message?: string);
}
export type UseWorkflowAwaiterOptions = {
    workflowName: string;
    timeoutMs?: number;
};
export type WorkflowResponseLike = {
    workflowId?: string;
    status?: string;
    errorMessage?: string | null;
};
export type AwaitWorkflowTrigger<T extends WorkflowResponseLike> = (idempotencyKey: string) => Promise<T>;
export type AwaitWorkflowResult<T extends WorkflowResponseLike = WorkflowResponseLike> = {
    response?: T;
    event?: WorkflowUpdatedV1;
};
export declare function useWorkflowAwaiter({ workflowName, timeoutMs, }: UseWorkflowAwaiterOptions): {
    awaitWorkflow: <T extends WorkflowResponseLike = WorkflowResponseLike>(trigger: AwaitWorkflowTrigger<T>) => Promise<AwaitWorkflowResult<T>>;
};
