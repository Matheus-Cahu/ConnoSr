import { useMutation } from "@tanstack/react-query";
import type { PresignUploadInput, PresignUploadResponse } from "@connosr/shared-types";
import { useApiClient } from "../context.js";

export function usePresignUpload() {
  const client = useApiClient();
  return useMutation({
    mutationFn: (input: PresignUploadInput) =>
      client.request<PresignUploadResponse>("/api/v1/uploads/presign", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}

/** Uploads a single local file/blob directly to the bucket via a presigned PUT URL. */
export async function uploadToPresignedUrl(
  uploadUrl: string,
  blob: Blob,
  contentType: string,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }
}
