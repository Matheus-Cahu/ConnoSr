import { createApiClient, createInMemoryTokenStorage } from "@connosr/api-client";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const tokenStorage = createInMemoryTokenStorage();

export const apiClient = createApiClient({
  baseUrl: API_URL,
  tokenStorage,
  credentials: "include",
  onAuthExpired: () => {
    tokenStorage.setAccessToken(null);
  },
});
