import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./context.js";

export function useHealthCheck() {
  const client = useApiClient();
  return useQuery({
    queryKey: ["health"],
    queryFn: () => client.request<{ status: string }>("/api/v1/health"),
    retry: false,
  });
}
