import { z } from "zod";

export const cursorPageQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type CursorPageQuery = z.infer<typeof cursorPageQuerySchema>;

export const cursorPageMetaSchema = z.object({
  nextCursor: z.string().nullable(),
});

export function cursorPageSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  });
}
