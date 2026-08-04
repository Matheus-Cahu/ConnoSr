import type { AuthTokens } from "@connosr/shared-types";
import type { TokenStorage } from "./tokenStorage.js";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`API error ${status}`);
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  tokenStorage: TokenStorage;
  /** Web relies on an httpOnly refresh cookie; mobile sends refreshToken explicitly. */
  credentials?: RequestCredentials;
  onAuthExpired?: () => void;
}

export interface ApiClient {
  request<T>(path: string, init?: RequestInit & { skipAuthRetry?: boolean }): Promise<T>;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const { baseUrl, tokenStorage, onAuthExpired } = config;
  const credentials = config.credentials ?? "include";

  let refreshPromise: Promise<boolean> | null = null;

  async function refreshTokens(): Promise<boolean> {
    const refreshToken = await tokenStorage.getRefreshToken();
    const res = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      credentials,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshToken ? { refreshToken } : {}),
    });
    if (!res.ok) return false;
    const tokens = (await res.json()) as AuthTokens;
    await tokenStorage.setAccessToken(tokens.accessToken);
    if (tokens.refreshToken) await tokenStorage.setRefreshToken(tokens.refreshToken);
    return true;
  }

  async function request<T>(
    path: string,
    init: RequestInit & { skipAuthRetry?: boolean } = {},
  ): Promise<T> {
    const { skipAuthRetry, ...requestInit } = init;
    const accessToken = await tokenStorage.getAccessToken();
    const headers = new Headers(requestInit.headers);
    if (requestInit.body !== undefined) {
      headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
    }
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    const res = await fetch(`${baseUrl}${path}`, {
      ...requestInit,
      credentials,
      headers,
    });

    if (res.status === 401 && !skipAuthRetry) {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null;
      });
      const refreshed = await refreshPromise;
      if (refreshed) {
        return request<T>(path, { ...init, skipAuthRetry: true });
      }
      onAuthExpired?.();
    }

    if (!res.ok) {
      const body = await res.json().catch(() => undefined);
      throw new ApiError(res.status, body);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  return { request };
}
