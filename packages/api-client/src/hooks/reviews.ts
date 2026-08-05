import { type InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AttachPhotoInput,
  Comment,
  CreateCommentInput,
  CreateReviewInput,
  Review,
  ReviewWithRelations,
  SimilarReviewsResponse,
} from "@connosr/shared-types";
import { useApiClient } from "../context.js";
import type { FeedPage } from "./feed.js";

export function useReview(id: string) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => client.request<ReviewWithRelations>(`/api/v1/reviews/${id}`),
    enabled: Boolean(id),
  });
}

export function useSimilarReviews(reviewId: string, limit = 10) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["reviews", reviewId, "similar", limit],
    queryFn: () =>
      client.request<SimilarReviewsResponse>(`/api/v1/reviews/${reviewId}/similar?limit=${limit}`),
    enabled: Boolean(reviewId),
  });
}

export function useCreateReview() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      client.request<Review>("/api/v1/reviews", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["experiences", review.experienceId] });
    },
  });
}

export function useAttachPhoto(reviewId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AttachPhotoInput) =>
      client.request(`/api/v1/reviews/${reviewId}/photos`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", reviewId] });
    },
  });
}

/**
 * Liking a review also pulls in reviews vectorially similar to it (same
 * experience/user/city, close rating) and splices them into the top of the
 * cached home feed, so the feed visibly reacts to what you just liked.
 *
 * The feed cache is patched directly (like state, then similar items)
 * rather than invalidated: invalidating would kick off a background refetch
 * that could resolve after the splice below and silently wipe it out.
 */
export function useLikeReview(reviewId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (like: boolean) =>
      client.request(`/api/v1/reviews/${reviewId}/like`, {
        method: like ? "POST" : "DELETE",
      }),
    onSuccess: async (_data, like) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", reviewId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      queryClient.setQueryData<InfiniteData<FeedPage>>(["feed"], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === reviewId
                ? { ...item, likedByCurrentUser: like, likeCount: item.likeCount + (like ? 1 : -1) }
                : item,
            ),
          })),
        };
      });

      if (!like) return;
      try {
        const similar = await client.request<SimilarReviewsResponse>(
          `/api/v1/reviews/${reviewId}/similar?limit=5`,
        );
        if (similar.items.length === 0) return;

        queryClient.setQueryData<InfiniteData<FeedPage>>(["feed"], (old) => {
          if (!old || old.pages.length === 0) return old;
          const existingIds = new Set(old.pages.flatMap((page) => page.items.map((item) => item.id)));
          const newItems = similar.items.filter(
            (item) => item.id !== reviewId && !existingIds.has(item.id),
          );
          if (newItems.length === 0) return old;

          const [firstPage, ...restPages] = old.pages;
          if (!firstPage) return old;
          return {
            ...old,
            pages: [{ ...firstPage, items: [...newItems, ...firstPage.items] }, ...restPages],
          };
        });
      } catch {
        // best-effort: composing the feed from similar posts is a nice-to-have,
        // never worth failing the like action over.
      }
    },
  });
}

export function useComments(reviewId: string) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["reviews", reviewId, "comments"],
    queryFn: () => client.request<Comment[]>(`/api/v1/reviews/${reviewId}/comments`),
    enabled: Boolean(reviewId),
  });
}

export function useCreateComment(reviewId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      client.request<Comment>(`/api/v1/reviews/${reviewId}/comments`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", reviewId, "comments"] });
    },
  });
}
