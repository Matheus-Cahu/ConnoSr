import { createContext, useContext, type ReactNode } from "react";
import type { ApiClient } from "./http.js";
import type { TokenStorage } from "./tokenStorage.js";

interface ApiClientContextValue {
  client: ApiClient;
  tokenStorage: TokenStorage;
}

const ApiClientContext = createContext<ApiClientContextValue | null>(null);

export function ApiClientProvider(props: {
  client: ApiClient;
  tokenStorage: TokenStorage;
  children: ReactNode;
}) {
  return (
    <ApiClientContext.Provider value={{ client: props.client, tokenStorage: props.tokenStorage }}>
      {props.children}
    </ApiClientContext.Provider>
  );
}

function useApiClientContext(): ApiClientContextValue {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }
  return context;
}

export function useApiClient(): ApiClient {
  return useApiClientContext().client;
}

export function useTokenStorage(): TokenStorage {
  return useApiClientContext().tokenStorage;
}
