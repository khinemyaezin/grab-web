import type { HateoasLink } from "./hateoas.js";
import { expandLink } from "./hateoas/link-resolver.js";
import type {
  PlatformApiClient,
  PlatformRequestBehavior,
  SessionExpiredReason,
} from "@khinemyaezin/seller-contracts";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestBehavior = PlatformRequestBehavior;

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  retryOnUnauthorized?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
};

export type ApiClientConfig = {
  baseUrl?: string;
  platform?: {
    session: {
      refresh(): Promise<void>;
      expire(reason?: SessionExpiredReason): void;
    };
  };
};

export interface ApiClient extends PlatformApiClient {
  get: <T>(
    endpoint: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => Promise<T>;
  post: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => Promise<T>;
  put: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => Promise<T>;
  patch: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => Promise<T>;
  delete: <T>(
    endpoint: string,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => Promise<T>;
  followLink: <T>(
    link: HateoasLink,
    method?: HttpMethod,
    body?: unknown,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => Promise<T>;
}

export class ApiError extends Error {
  public code?: string;
  public detail?: string;
  public requestId?: string;

  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
    options?: {
      code?: string;
      detail?: string;
      requestId?: string;
      cause?: unknown;
    },
  ) {
    const detailMsg = options?.detail ? `: ${options.detail}` : "";
    super(`API Error: ${status} ${statusText}${detailMsg}`);
    this.name = "ApiError";
    this.code = options?.code;
    this.detail = options?.detail;
    this.requestId = options?.requestId;
    if (options?.cause) {
      this.cause = options.cause;
    }
  }

  get data(): unknown {
    return this.body;
  }
}

export class TimeoutError extends ApiError {
  constructor(timeoutMs: number) {
    super(408, "Request Timeout", null, {
      code: "REQUEST_TIMEOUT",
      detail: `Request timed out after ${timeoutMs}ms`,
    });
    this.name = "TimeoutError";
  }
}

export class AbortError extends ApiError {
  constructor(message = "Request was aborted") {
    super(499, "Client Closed Request", null, {
      code: "REQUEST_ABORTED",
      detail: message,
    });
    this.name = "AbortError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return (
    error instanceof TimeoutError || (error instanceof ApiError && error.code === "REQUEST_TIMEOUT")
  );
}

export function isAbortError(error: unknown): error is AbortError {
  return (
    error instanceof AbortError || (error instanceof ApiError && error.code === "REQUEST_ABORTED")
  );
}

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

function createRequestSignal(
  timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS,
  callerSignal?: AbortSignal,
): { signal: AbortSignal; cleanup: () => void; isTimeout: () => boolean } {
  const controller = new AbortController();
  let timedOut = false;
  let timerId: ReturnType<typeof setTimeout> | undefined;

  if (timeoutMs > 0 && timeoutMs !== Infinity) {
    timerId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
  }

  const onCallerAbort = () => {
    controller.abort();
  };

  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort();
    } else {
      callerSignal.addEventListener("abort", onCallerAbort, { once: true });
    }
  }

  const cleanup = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    if (callerSignal) {
      callerSignal.removeEventListener("abort", onCallerAbort);
    }
  };

  return {
    signal: controller.signal,
    cleanup,
    isTimeout: () => timedOut,
  };
}

async function buildUrl(endpoint: string, params?: Record<string, string>): Promise<string> {
  if (!params || Object.keys(params).length === 0) return endpoint;
  const searchParams = new URLSearchParams(params);
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}${searchParams.toString()}`;
}

async function buildRequestInit(
  _config: ApiClientConfig,
  { method = "GET", headers = {}, body, signal }: RequestOptions,
): Promise<RequestInit> {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/hal+json, application/problem+json",
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    credentials: "include",
    ...(signal ? { signal } : {}),
  };
}

async function buildFullUrl(
  config: ApiClientConfig,
  endpoint: string,
  params?: Record<string, string>,
): Promise<string> {
  const url = await buildUrl(endpoint, params);

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const base = config.baseUrl?.replace(/\/$/, "") || "";
  if (!base) {
    return url;
  }

  const normalizedUrl = url.startsWith("/") ? url.slice(1) : url;
  return `${base}/${normalizedUrl}`;
}

class RefreshCoordinator {
  private inFlight: Promise<void> | null = null;

  run(task: () => Promise<void>): Promise<void> {
    if (!this.inFlight) {
      this.inFlight = task().finally(() => {
        this.inFlight = null;
      });
    }
    return this.inFlight;
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const requestId =
      response.headers.get("x-request-id") ?? response.headers.get("request-id") ?? undefined;

    let body: unknown;
    try {
      if (
        contentType.includes("application/json") ||
        contentType.includes("application/hal+json") ||
        contentType.includes("application/problem+json")
      ) {
        body = await response.json().catch(() => null);
      } else {
        body = await response.text().catch(() => null);
      }
    } catch {
      body = null;
    }

    let code: string | undefined;
    let detail: string | undefined;

    if (body && typeof body === "object") {
      const obj = body as Record<string, unknown>;
      if (typeof obj.code === "string") code = obj.code;
      if (typeof obj.detail === "string") detail = obj.detail;
      else if (typeof obj.message === "string") detail = obj.message;
      else if (typeof obj.title === "string") detail = obj.title;
      if (!requestId && typeof obj.requestId === "string") {
        // requestId from body if not present in header
      }
    }

    throw new ApiError(response.status, response.statusText, body, {
      code,
      detail,
      requestId,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength === "0") {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!text.trim()) {
    return undefined as T;
  }

  if (
    contentType.includes("application/json") ||
    contentType.includes("application/hal+json") ||
    contentType.includes("application/problem+json")
  ) {
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  return text as unknown as T;
}

export function createApiClient(initialConfig: ApiClientConfig = {}): ApiClient {
  const clientConfig: Required<Pick<ApiClientConfig, "baseUrl">> & ApiClientConfig = {
    baseUrl: "/api",
    ...initialConfig,
  };
  const refreshCoordinator = new RefreshCoordinator();
  let lastRefreshedAt = 0;

  async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const requestInitiatedAt = Date.now();
    const timeoutMs = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    const { signal, cleanup, isTimeout } = createRequestSignal(timeoutMs, options.signal);

    let response: Response;
    let fullUrl: string;
    try {
      fullUrl = await buildFullUrl(clientConfig, endpoint, options.params);
      const config = await buildRequestInit(clientConfig, { ...options, signal });
      response = await fetch(fullUrl, config);
    } catch (fetchError: unknown) {
      cleanup();
      if (isTimeout()) {
        throw new TimeoutError(timeoutMs);
      }
      if (options.signal?.aborted) {
        throw new AbortError("Request was aborted by caller");
      }
      if ((fetchError as Error)?.name === "AbortError") {
        throw new AbortError();
      }
      throw fetchError;
    }

    if (response.status === 401 && options.retryOnUnauthorized !== false && clientConfig.platform) {
      const platformSession = clientConfig.platform.session;
      if (requestInitiatedAt >= lastRefreshedAt) {
        try {
          await refreshCoordinator.run(async () => {
            await platformSession.refresh();
            lastRefreshedAt = Date.now();
          });
        } catch (refreshError: unknown) {
          cleanup();
          const status =
            refreshError instanceof ApiError
              ? refreshError.status
              : ((refreshError as { status?: number; statusCode?: number })?.status ??
                (refreshError as { status?: number; statusCode?: number })?.statusCode);
          if (status === 401 || status === 403) {
            platformSession.expire("refresh-failed");
          }
          throw refreshError;
        }
      }

      let retryResponse: Response;
      try {
        const freshConfig = await buildRequestInit(clientConfig, { ...options, signal });
        retryResponse = await fetch(fullUrl, freshConfig);
      } catch (retryFetchError: unknown) {
        cleanup();
        if (isTimeout()) {
          throw new TimeoutError(timeoutMs);
        }
        if (options.signal?.aborted) {
          throw new AbortError("Request was aborted by caller");
        }
        throw retryFetchError;
      }
      cleanup();
      if (retryResponse.status === 401) {
        platformSession.expire("unauthorized");
      }
      return readResponse<T>(retryResponse);
    }

    cleanup();
    return readResponse<T>(response);
  }

  return {
    get: <T>(
      endpoint: string,
      params?: Record<string, string>,
      headers?: Record<string, string>,
      behavior?: RequestBehavior,
    ) => request<T>(endpoint, { params, headers, ...behavior }),

    post: <T>(
      endpoint: string,
      body?: unknown,
      headers?: Record<string, string>,
      behavior?: RequestBehavior,
    ) => request<T>(endpoint, { method: "POST", body, headers, ...behavior }),

    put: <T>(
      endpoint: string,
      body?: unknown,
      headers?: Record<string, string>,
      behavior?: RequestBehavior,
    ) => request<T>(endpoint, { method: "PUT", body, headers, ...behavior }),

    patch: <T>(
      endpoint: string,
      body?: unknown,
      headers?: Record<string, string>,
      behavior?: RequestBehavior,
    ) => request<T>(endpoint, { method: "PATCH", body, headers, ...behavior }),

    delete: <T>(endpoint: string, headers?: Record<string, string>, behavior?: RequestBehavior) =>
      request<T>(endpoint, { method: "DELETE", headers, ...behavior }),

    followLink: <T>(
      link: HateoasLink,
      method: HttpMethod = "GET",
      body?: unknown,
      params?: Record<string, string>,
      headers?: Record<string, string>,
      behavior?: RequestBehavior,
    ) => {
      const { href, remainingParams } = expandLink(link, params);
      return request<T>(href, {
        method,
        body,
        params: remainingParams,
        headers,
        ...behavior,
      });
    },
  };
}
