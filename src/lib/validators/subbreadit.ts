import { z } from "zod";

export const subbreaditValidator = z.object({
  name: z.string().min(1).max(21),
});

export const subbreaditSubscriptionValidator = z.object({
  subbreaditId: z.string(),
});

export type CreateSubbreaditPayload = z.infer<typeof subbreaditValidator>;
export type SubscribeToSubbreaditPayload = z.infer<
  typeof subbreaditSubscriptionValidator
>;
