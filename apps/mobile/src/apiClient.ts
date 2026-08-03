import * as SecureStore from "expo-secure-store";
import { createApiClient, type TokenStorage } from "@connosr/api-client";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

const ACCESS_TOKEN_KEY = "connosr.accessToken";
const REFRESH_TOKEN_KEY = "connosr.refreshToken";

const secureTokenStorage: TokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken: async (token) => {
    if (token) await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: async (token) => {
    if (token) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};

export const tokenStorage = secureTokenStorage;

export const apiClient = createApiClient({
  baseUrl: API_URL,
  tokenStorage: secureTokenStorage,
  credentials: "omit",
  onAuthExpired: () => {
    void secureTokenStorage.setAccessToken(null);
    void secureTokenStorage.setRefreshToken(null);
  },
});
