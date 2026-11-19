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
  timeoutMs?: number;
  signal?: AbortSignal;
};

type CsrfTokenResponse = {
  headerName: string;
  parameterName: string;
  token: string;
};

export type ApiClientConfig = {
  baseUrl?: string;
  platform?: {
    session: {
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
  csrfToken: () => Promise<CsrfTokenResponse>,
  { method = "GET", headers = {}, body, signal }: RequestOptions,
): Promise<RequestInit> {
  const requestHeaders = new Headers({
    "Content-Type": "application/json",
    Accept: "application/hal+json, application/problem+json",
    ...headers,
  });
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    const csrf = await csrfToken();
    requestHeaders.set(csrf.headerName, csrf.token);
  }
  return {
    method,
    headers: requestHeaders,
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
    baseUrl: "/api/v1",
    ...initialConfig,
  };
  let csrfTokenPromise: Promise<CsrfTokenResponse> | null = null;

  async function fetchCsrfToken(): Promise<CsrfTokenResponse> {
    if (!csrfTokenPromise) {
      csrfTokenPromise = (async () => {
        const rootUrl = new URL(
          clientConfig.baseUrl.replace(/\/$/, ""),
          typeof window === "undefined" ? "http://localhost" : window.location.origin,
        ).toString();
        const rootResponse = await fetch(rootUrl, {
          method: "GET",
          headers: { Accept: "application/hal+json, application/json" },
          credentials: "include",
          cache: "no-store",
        });
        if (!rootResponse.ok) {
          throw new ApiError(rootResponse.status, rootResponse.statusText, null);
        }
        const apiRoot = (await rootResponse.json()) as {
          _links?: Record<string, { href: string }>;
        };
        const identityRootLink = apiRoot._links?.["get-identity-root"];
        if (!identityRootLink?.href) {
          throw new Error("API root does not expose a 'get-identity-root' link");
        }

        const identityRootUrl = new URL(identityRootLink.href, rootUrl).toString();
        const identityResponse = await fetch(identityRootUrl, {
          method: "GET",
          headers: { Accept: "application/hal+json, application/json" },
          credentials: "include",
          cache: "no-store",
        });
        if (!identityResponse.ok) {
          throw new ApiError(identityResponse.status, identityResponse.statusText, null);
        }
        const identityRoot = (await identityResponse.json()) as {
          _links?: Record<string, { href: string }>;
        };
        const csrfLink = identityRoot._links?.["get-csrf-token"];
        if (!csrfLink?.href) {
          throw new Error("Identity root does not expose a 'get-csrf-token' link");
        }

        const csrfUrl = new URL(csrfLink.href, identityRootUrl).toString();
        const csrfResponse = await fetch(csrfUrl, {
          method: "GET",
          headers: { Accept: "application/hal+json, application/json" },
          credentials: "include",
          cache: "no-store",
        });
        if (!csrfResponse.ok) {
          throw new ApiError(csrfResponse.status, csrfResponse.statusText, null);
        }
        const value = (await csrfResponse.json()) as Partial<CsrfTokenResponse>;
        if (!value.headerName || !value.parameterName || !value.token) {
          throw new Error("CSRF endpoint returned an invalid token response");
        }
        return value as CsrfTokenResponse;
      })().catch((error) => {
        csrfTokenPromise = null;
        throw error;
      });
    }
    return csrfTokenPromise;
  }

  async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    const { signal, cleanup, isTimeout } = createRequestSignal(timeoutMs, options.signal);

    let response: Response;
    let fullUrl: string;
    try {
      fullUrl = await buildFullUrl(clientConfig, endpoint, options.params);
      const config = await buildRequestInit(fetchCsrfToken, { ...options, signal });
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

    if (response.status === 401 && clientConfig.platform) {
      clientConfig.platform.session.expire("unauthorized");
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
