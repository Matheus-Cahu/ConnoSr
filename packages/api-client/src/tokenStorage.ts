export interface TokenStorage {
  getAccessToken(): string | null | Promise<string | null>;
  setAccessToken(token: string | null): void | Promise<void>;
  getRefreshToken(): string | null | Promise<string | null>;
  setRefreshToken(token: string | null): void | Promise<void>;
}

export function createInMemoryTokenStorage(): TokenStorage {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  return {
    getAccessToken: () => accessToken,
    setAccessToken: (token) => {
      accessToken = token;
    },
    getRefreshToken: () => refreshToken,
    setRefreshToken: (token) => {
      refreshToken = token;
    },
  };
}
