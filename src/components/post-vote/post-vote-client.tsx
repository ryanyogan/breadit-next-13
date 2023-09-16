"use client";

import useCustomToast from "@/hooks/use-custom-toast";
import { cn } from "@/lib/utils";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

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

  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button size="sm" variant="ghost" aria-label="upvote">
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

      <Button size="sm" variant="ghost" aria-label="downvote">
        <ArrowBigDown
          className={cn(
            "h-5 w-5 text-zinc-700",
            curentVote === "UP" && "text-red-50 fill-red-500"
          )}
        />
      </Button>
    </div>
  );
}
