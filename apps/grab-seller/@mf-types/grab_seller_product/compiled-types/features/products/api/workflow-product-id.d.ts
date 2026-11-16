import type { PlatformApiClient } from "@khinemyaezin/seller-contracts";
import type { CreateSellableProductResponse } from "@/features/products/types";
import type { AwaitWorkflowResult } from "@/features/products/use-workflow-awaiter";
export declare function resolveWorkflowProductId(api: PlatformApiClient, result: AwaitWorkflowResult<CreateSellableProductResponse>): Promise<string>;
