import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env.js";

export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  forcePathStyle: env.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET = env.S3_BUCKET;

const PHOTO_READ_URL_TTL_SECONDS = 15 * 60;

/** Returns a stable public URL if configured, otherwise a short-lived presigned GET URL. */
export function getPhotoUrl(objectKey: string): Promise<string> {
  if (env.S3_PUBLIC_BASE_URL) {
    return Promise.resolve(`${env.S3_PUBLIC_BASE_URL}/${objectKey}`);
  }
  return getSignedUrl(s3Client, new GetObjectCommand({ Bucket: S3_BUCKET, Key: objectKey }), {
    expiresIn: PHOTO_READ_URL_TTL_SECONDS,
  });
}
