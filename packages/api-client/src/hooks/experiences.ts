import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateExperienceInput,
  Experience,
  SearchExperiencesQuery,
} from "@connosr/shared-types";
import { useApiClient } from "../context.js";

function buildQueryString(query: SearchExperiencesQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.city) params.set("city", query.city);
  if (query.cursor) params.set("cursor", query.cursor);
  params.set("limit", String(query.limit));
  return params.toString();
}

export function useExperiences(query: SearchExperiencesQuery) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["experiences", query],
    queryFn: () =>
      client.request<{ items: Experience[]; nextCursor: string | null }>(
        `/api/v1/experiences?${buildQueryString(query)}`,
      ),
  });
}

export function useExperience(id: string) {
  const client = useApiClient();
  return useQuery({
    queryKey: ["experiences", id],
    queryFn: () => client.request<Experience>(`/api/v1/experiences/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateExperience() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExperienceInput) =>
      client.request<Experience>("/api/v1/experiences", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });
}
