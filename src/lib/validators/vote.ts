import { z } from "zod";

export const voteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type PostVoteRequest = z.infer<typeof voteValidator>;

export const commentValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type CommentVoteRequest = z.infer<typeof commentValidator>;
