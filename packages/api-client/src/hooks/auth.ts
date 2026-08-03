import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthResponse, LoginInput, SignupInput, User } from "@connosr/shared-types";
import { useApiClient, useTokenStorage } from "../context.js";

export function useMe() {
  const client = useApiClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => client.request<User>("/api/v1/auth/me"),
    retry: false,
  });
}

async function persistTokens(tokenStorage: ReturnType<typeof useTokenStorage>, data: AuthResponse) {
  await tokenStorage.setAccessToken(data.tokens.accessToken);
  await tokenStorage.setRefreshToken(data.tokens.refreshToken);
}

export function useLogin() {
  const client = useApiClient();
  const tokenStorage = useTokenStorage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) =>
      client.request<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: async (data) => {
      await persistTokens(tokenStorage, data);
      queryClient.setQueryData(["me"], data.user);
    },
  });
}

export function useSignup() {
  const client = useApiClient();
  const tokenStorage = useTokenStorage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SignupInput) =>
      client.request<AuthResponse>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: async (data) => {
      await persistTokens(tokenStorage, data);
      queryClient.setQueryData(["me"], data.user);
    },
  });
}

export function useLogout() {
  const client = useApiClient();
  const tokenStorage = useTokenStorage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => client.request<void>("/api/v1/auth/logout", { method: "POST" }),
    onSuccess: async () => {
      await tokenStorage.setAccessToken(null);
      await tokenStorage.setRefreshToken(null);
      queryClient.setQueryData(["me"], null);
      queryClient.clear();
    },
  });
}
