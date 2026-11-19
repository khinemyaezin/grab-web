export type PlatformHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type PlatformRequestBehavior = {
  timeoutMs?: number;
  signal?: AbortSignal;
};

export interface PlatformLink {
  href: string;
  templated?: boolean;
}

export interface PlatformApiClient {
  get<T>(
    endpoint: string,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    behavior?: PlatformRequestBehavior,
  ): Promise<T>;
  post<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    behavior?: PlatformRequestBehavior,
  ): Promise<T>;
  put<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    behavior?: PlatformRequestBehavior,
  ): Promise<T>;
  patch<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    behavior?: PlatformRequestBehavior,
  ): Promise<T>;
  delete<T>(
    endpoint: string,
    headers?: Record<string, string>,
    behavior?: PlatformRequestBehavior,
  ): Promise<T>;
  followLink<T>(
    link: PlatformLink,
    method?: PlatformHttpMethod,
    body?: unknown,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    behavior?: PlatformRequestBehavior,
  ): Promise<T>;
}
