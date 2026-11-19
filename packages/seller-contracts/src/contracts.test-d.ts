import type { PlatformApiClient, SellerPlatform, SessionApi, SessionSnapshot } from "./index.js";
import type { WorkflowUpdatedV1 } from "./events/index.js";

// Pure compile-time type verification utilities
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type HasProperty<T, K extends string> = K extends keyof T ? true : false;

// 1. SessionApi contracts
export type _TestSessionExpire = Expect<HasProperty<SessionApi, "expire">>;
export type _TestSessionRefresh = Expect<HasProperty<SessionApi, "refresh">>;
export type _TestSessionLogout = Expect<HasProperty<SessionApi, "logout">>;
export type _TestSessionGetSnapshot = Expect<HasProperty<SessionApi, "getSnapshot">>;
export type _TestSessionSubscribe = Expect<HasProperty<SessionApi, "subscribe">>;
export type _TestPlatformSession = Expect<Equal<SellerPlatform["session"], SessionApi>>;
export type _TestSnapshotObject = Expect<HasProperty<SessionSnapshot, "status">>;

// 2. Platform contracts
export type _TestPlatformApi = Expect<Equal<SellerPlatform["api"], PlatformApiClient>>;
export type _TestPlatformApiClientGet = Expect<HasProperty<PlatformApiClient, "get">>;
export type _TestPlatformApiClientPost = Expect<HasProperty<PlatformApiClient, "post">>;
export type _TestPlatformApiClientFollowLink = Expect<HasProperty<PlatformApiClient, "followLink">>;

// 3. Event contracts
export type _TestWorkflowUpdatedWorkflowId = Expect<HasProperty<WorkflowUpdatedV1, "workflowId">>;
export type _TestWorkflowUpdatedStatus = Expect<HasProperty<WorkflowUpdatedV1, "status">>;
export type _TestWorkflowUpdatedProducerId = Expect<HasProperty<WorkflowUpdatedV1, "producerId">>;
