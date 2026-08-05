import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FollowListItem, ReviewWithRelations, UpdateUserInput, User } from "@connosr/shared-types";
import { useApiClient } from "../context.js";

interface UserReviewsPage {
  items: ReviewWithRelations[];
  nextCursor: string | null;
}

export function useUser(id: string) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => client.request<User>(`/api/v1/users/${id}`),
    enabled: Boolean(id),
  });
}

export function useUpdateMe() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) =>
      client.request<User>("/api/v1/users/me", {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
    },
  });
}

export function useFollowers(userId: string) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["users", userId, "followers"],
    queryFn: () => client.request<FollowListItem[]>(`/api/v1/users/${userId}/followers`),
    enabled: Boolean(userId),
  });
}

export function useFollowing(userId: string) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["users", userId, "following"],
    queryFn: () => client.request<FollowListItem[]>(`/api/v1/users/${userId}/following`),
    enabled: Boolean(userId),
  });
}

export function useUserReviews(userId: string) {
  const client = useApiClient();
  return useInfiniteQuery({
    queryKey: ["users", userId, "reviews"],
    queryFn: ({ pageParam }: { pageParam: string | null }) => {
      const params = new URLSearchParams({ limit: "20" });
      if (pageParam) params.set("cursor", pageParam);
      return client.request<UserReviewsPage>(`/api/v1/users/${userId}/reviews?${params.toString()}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(userId),
  });
}

export function useFollowUser(userId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (follow: boolean) =>
      client.request(`/api/v1/users/${userId}/follow`, {
        method: follow ? "POST" : "DELETE",
      }),
    onSuccess: () => {
      // Broad invalidation (not just ["users", userId]) so lists that embed this
      // user's followedByCurrentUser flag elsewhere — search results, followers/
      // following lists — pick up the change too.
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useSearchUsers(query: string, limit = 20) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["users", "search", query, limit],
    queryFn: () =>
      client.request<FollowListItem[]>(
        `/api/v1/users?q=${encodeURIComponent(query)}&limit=${limit}`,
      ),
    enabled: query.trim().length > 0,
  });
}
