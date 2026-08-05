import { useInfiniteQuery } from "@tanstack/react-query";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { useApiClient } from "../context.js";

export interface FeedPage {
  items: ReviewWithRelations[];
  nextCursor: string | null;
}

export function useFeed() {
  const client = useApiClient();
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }: { pageParam: string | null }) => {
      const params = new URLSearchParams({ limit: "20" });
      if (pageParam) params.set("cursor", pageParam);
      return client.request<FeedPage>(`/api/v1/feed?${params.toString()}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
