import type { HateoasLink } from "./hateoas.js";
import { removeTemplateFromUrl } from "./hateoas/link-resolver.js";
import type { PlatformApiClient, SessionExpiredReason } from "@khinemyaezin/seller-contracts";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestBehavior = {
  retryOnUnauthorized?: boolean;
};

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  retryOnUnauthorized?: boolean;
};

export type ApiClientConfig = {
  baseUrl?: string;
  platform?: {
    session: {
      refresh(): Promise<void>;
      expire(reason?: SessionExpiredReason): void;
    };
  };
  getToken?: () => string | undefined | Promise<string | undefined>;
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

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown,
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

async function buildUrl(endpoint: string, params?: Record<string, string>): Promise<string> {
  if (!params) return endpoint;
  const searchParams = new URLSearchParams(params);
  return `${endpoint}?${searchParams.toString()}`;
}

async function buildRequestInit(
  config: ApiClientConfig,
  { method = "GET", headers = {}, body }: RequestOptions,
): Promise<RequestInit> {
  const token = config.getToken ? await config.getToken() : undefined;

  return {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/hal+json, application/problem+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    credentials: "include",
  };
}

async function buildFullUrl(
  config: ApiClientConfig,
  endpoint: string,
  params?: Record<string, string>,
): Promise<string> {
  const url = await buildUrl(endpoint, params);

  if (url.startsWith("http")) {
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
    const data: unknown = contentType.includes("json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);
    throw new ApiError(response.status, response.statusText, data);
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
    const fullUrl = await buildFullUrl(clientConfig, endpoint, options.params);
    const config = await buildRequestInit(clientConfig, options);
    const response = await fetch(fullUrl, config);

    if (response.status === 401 && options.retryOnUnauthorized !== false && clientConfig.platform) {
      const platformSession = clientConfig.platform.session;
      if (requestInitiatedAt >= lastRefreshedAt) {
        try {
          await refreshCoordinator.run(async () => {
            await platformSession.refresh();
            lastRefreshedAt = Date.now();
          });
        } catch (refreshError: unknown) {
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

      const freshConfig = await buildRequestInit(clientConfig, options);
      const retryResponse = await fetch(fullUrl, freshConfig);
      if (retryResponse.status === 401) {
        platformSession.expire("unauthorized");
      }
      return readResponse<T>(retryResponse);
    }

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
      const href = removeTemplateFromUrl(link);
      return request<T>(href, { method, body, params, headers, ...behavior });
    },
  };
}

export { ApiError };
