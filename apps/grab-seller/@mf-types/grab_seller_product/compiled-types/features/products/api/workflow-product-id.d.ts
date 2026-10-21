import type { CreateSellableProductResponse } from "@/features/products/types";
import type { AwaitWorkflowResult } from "@/features/products/hooks/use-workflow-awaiter";
export declare function resolveWorkflowProductId(result: AwaitWorkflowResult<CreateSellableProductResponse>): Promise<string>;
