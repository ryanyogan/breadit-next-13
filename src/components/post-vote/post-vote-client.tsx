"use client";

import useCustomToast from "@/hooks/use-custom-toast";
import { cn } from "@/lib/utils";
import { PostVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmount: number;
  initialVote?: VoteType | null;
}

export default function PostVoteClient({
  postId,
  initialVotesAmount,
  initialVote,
}: PostVoteClientProps) {
  const { loginToast } = useCustomToast();
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
  const [curentVote, setCurrentVote] = useState(initialVote);
  const previousVote = usePrevious(curentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch(`/api/subbreadit/post/vote`, payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") {
        setVotesAmount((prev) => prev - 1);
      } else {
        setVotesAmount((prev) => prev + 1);
      }

      setCurrentVote(previousVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    },
    onMutate: (type: VoteType) => {
      if (curentVote === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmount((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
      } else {
        setCurrentVote(type);
        if (type === "UP")
          setVotesAmount((prev) => prev + (curentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmount((prev) => prev - (curentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn(
            "h-5 w-5 text-zinc-700",
            curentVote === "UP" && "text-emerald-50 fill-emerald-500"
          )}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmount}
      </p>

      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn(
            "h-5 w-5 text-zinc-700",
            curentVote === "DOWN" && "text-red-50 fill-red-500"
          )}
        />
      </Button>
    </div>
  );
}
