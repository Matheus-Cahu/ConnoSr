import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AttachPhotoInput,
  Comment,
  CreateCommentInput,
  CreateReviewInput,
  Review,
  ReviewWithRelations,
} from "@connosr/shared-types";
import { useApiClient } from "../context.js";

export function useReview(id: string) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => client.request<ReviewWithRelations>(`/api/v1/reviews/${id}`),
    enabled: Boolean(id),
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

export function useLikeReview(reviewId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (like: boolean) =>
      client.request(`/api/v1/reviews/${reviewId}/like`, {
        method: like ? "POST" : "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", reviewId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
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
