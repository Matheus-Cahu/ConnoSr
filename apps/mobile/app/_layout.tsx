import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApiClientProvider, createQueryClient } from "@connosr/api-client";
import { apiClient, tokenStorage } from "../src/apiClient";

const queryClient = createQueryClient();

export default function RootLayout() {
  return (
    <ApiClientProvider client={apiClient} tokenStorage={tokenStorage}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerTitle: "ConnoSr" }} />
      </QueryClientProvider>
    </ApiClientProvider>
  );
}
