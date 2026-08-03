import { z } from "zod";

export const photoSchema = z.object({
  id: z.string().uuid(),
  reviewId: z.string().uuid(),
  url: z.string().url(),
  position: z.number().int().min(0),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
});
export type Photo = z.infer<typeof photoSchema>;

export const presignUploadInputSchema = z.object({
  files: z
    .array(
      z.object({
        contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        fileSize: z
          .number()
          .int()
          .positive()
          .max(15 * 1024 * 1024),
      }),
    )
    .min(1)
    .max(10),
});
export type PresignUploadInput = z.infer<typeof presignUploadInputSchema>;

export const presignUploadResponseSchema = z.object({
  files: z.array(
    z.object({
      uploadUrl: z.string().url(),
      objectKey: z.string(),
      expiresIn: z.number().int().positive(),
    }),
  ),
});
export type PresignUploadResponse = z.infer<typeof presignUploadResponseSchema>;

export const attachPhotoInputSchema = z.object({
  objectKey: z.string().min(1),
  position: z.number().int().min(0),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type AttachPhotoInput = z.infer<typeof attachPhotoInputSchema>;
