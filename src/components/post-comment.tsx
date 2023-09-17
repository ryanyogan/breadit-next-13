"use client";

import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";
import { Comment, CommentVote, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CommentVotes from "./comment-votes";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import UserAvatar from "./user-avatar";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface Props {
  comment: ExtendedComment;
  votesAmount: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

export default function PostComment({
  comment,
  votesAmount,
  currentVote,
  postId,
}: Props) {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, replyToId, text }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        replyToId,
        text,
      };

      const { data } = await axios.patch(
        `/api/subbreadit/post/comment`,
        payload
      );
      return data;
    },
    onError: () => {
      return toast({
        title: "Something Went Wrong",
        description: "Comment was not posted, try again!",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
      setIsReplying(false);
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmount={votesAmount}
          initialVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) {
              return router.push(`/sign-in`);
            }
            setIsReplying(true);
          }}
          aria-label="reply"
          variant="ghost"
          size="xs"
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
              <Textarea
                value={input}
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                id="comment"
                name="comment"
                placeholder="Here's one thing..."
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!input) return;
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                  isLoading={isLoading}
                  disabled={input.length === 0}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
