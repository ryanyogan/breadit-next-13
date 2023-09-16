import { z } from "zod";

export const postValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer." })
    .max(128, { message: "Title must be no longer than 128 characters" }),
  subbreaditId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof postValidator>;
