import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { presignUploadInputSchema } from "@connosr/shared-types";
import { s3Client, S3_BUCKET } from "../../lib/s3.js";

const PRESIGN_EXPIRY_SECONDS = 5 * 60;
const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post("/presign", { preHandler: fastify.authenticate }, async (request, reply) => {
    const input = presignUploadInputSchema.parse(request.body);

    const files = await Promise.all(
      input.files.map(async (file) => {
        const extension = EXTENSION_BY_CONTENT_TYPE[file.contentType];
        const objectKey = `uploads/${request.userId}/${randomUUID()}.${extension}`;
        const uploadUrl = await getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: objectKey,
            ContentType: file.contentType,
          }),
          { expiresIn: PRESIGN_EXPIRY_SECONDS },
        );
        return { uploadUrl, objectKey, expiresIn: PRESIGN_EXPIRY_SECONDS };
      }),
    );

    return reply.send({ files });
  });
}
