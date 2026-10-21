import type { HateoasLink } from "./hateoas.js";
import { removeTemplateFromUrl } from "./hateoas/link-resolver.js";

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
  platform?: { session: { refresh(): Promise<void> } };
  getToken?: () => string | undefined | Promise<string | undefined>;
};

let clientConfig: Required<Pick<ApiClientConfig, "baseUrl">> & ApiClientConfig = {
  baseUrl: "/api",
};

export function configureApi(config: ApiClientConfig): void {
  clientConfig = { ...clientConfig, ...config };
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

async function buildRequestInit({ method = "GET", headers = {}, body }: RequestOptions): Promise<RequestInit> {
  const token = clientConfig.getToken ? await clientConfig.getToken() : undefined;
  
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

async function buildFullUrl(endpoint: string, params?: Record<string, string>): Promise<string> {
  const url = await buildUrl(endpoint, params);
  
  if (url.startsWith("http")) {
    return url;
  }

  const base = clientConfig.baseUrl?.replace(/\/$/, "") || "";
  if (!base) {
    return url;
  }

  const normalizedUrl = url.startsWith("/") ? url.slice(1) : url;
  return `${base}/${normalizedUrl}`;
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(response.status, response.statusText, data)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get("content-type")
  const contentLength = response.headers.get("content-length")

  if (contentLength === "0") {
    return undefined as T
  }

  if (!contentType?.includes("application/hal+json")) {
    return undefined as T
  }

  const text = await response.text()

  if (!text.trim()) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const fullUrl = await buildFullUrl(endpoint, options.params)
  const config = await buildRequestInit(options)
  const response = await fetch(fullUrl, config)

  if (
    response.status === 401 &&
    options.retryOnUnauthorized !== false &&
    clientConfig.platform
  ) {
    await clientConfig.platform.session.refresh()
        return readResponse<T>(await fetch(fullUrl, config))
  }

  return readResponse<T>(response)
}

export const api = {
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
    body: unknown,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => request<T>(endpoint, { method: "PUT", body, headers, ...behavior }),

  patch: <T>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => request<T>(endpoint, { method: "PATCH", body, headers, ...behavior }),

  delete: <T>(
    endpoint: string,
    headers?: Record<string, string>,
    behavior?: RequestBehavior,
  ) => request<T>(endpoint, { method: "DELETE", headers, ...behavior }),

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

export { ApiError };
