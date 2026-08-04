import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApiClientProvider, createQueryClient } from "@connosr/api-client";
import { apiClient, tokenStorage } from "./apiClient.js";
import { App } from "./App.js";
import "./index.css";

const queryClient = createQueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApiClientProvider client={apiClient} tokenStorage={tokenStorage}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ApiClientProvider>
  </StrictMode>,
);
