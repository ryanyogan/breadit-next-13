"use client";

import useCustomToast from "@/hooks/use-custom-toast";
import { CommentRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";

interface Props {
  postId: string;
  replyToId?: string;
}

export default function CreateComment({ postId, replyToId }: Props) {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();

  const { mutate: post, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        `/api/subbreadit/post/comment`,
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was a problem.",
        description: "Something blew up, small though",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
    },
  });

  return (
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

        <div className="mt-2 flex justify-end">
          <Button
            onClick={() =>
              post({
                postId,
                text: input,
                replyToId,
              })
            }
            isLoading={isLoading}
            disabled={input.length === 0}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
