export type WorkflowStepStatus = "skipped" | "ok" | "failed";
export type WorkflowFailurePolicy = "abort" | "stop" | "continue";
export type WorkflowChainStatus = "completed" | "stopped" | "aborted";
export type WorkflowSyncStatus = "skipped" | "synced" | "failed";
export type WorkflowStepResult<TCtx extends object = object> = {
    status: WorkflowStepStatus;
    error?: Error;
    patch?: Partial<TCtx>;
};
export type WorkflowStep<TCtx extends object> = {
    id: string;
    run: (ctx: TCtx) => Promise<WorkflowStepResult<TCtx>>;
    onFailure?: WorkflowFailurePolicy | ((ctx: TCtx) => WorkflowFailurePolicy);
};
export type WorkflowChainResult<TCtx extends object> = {
    status: WorkflowChainStatus;
    ctx: TCtx;
    steps: Record<string, WorkflowStepResult<TCtx>>;
    failedStepId?: string;
    error?: Error;
};
export declare function toWorkflowStepResult<TCtx extends object = object>(result: {
    status: WorkflowSyncStatus;
    error?: Error;
}): WorkflowStepResult<TCtx>;
export declare function isWorkflowChainIdle<TCtx extends object>(result: WorkflowChainResult<TCtx>): boolean;
export declare function runWorkflowChain<TCtx extends object>(steps: WorkflowStep<TCtx>[], initialCtx: TCtx): Promise<WorkflowChainResult<TCtx>>;
