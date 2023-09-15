"use client";

import { SubscribeToSubbreaditPayload } from "@/lib/validators/subbreadit";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./ui/button";

interface Props {
  subbreaditId: string;
}

export default function SubscribeLeaveToggle({ subbreaditId }: Props) {
  const isSubscribed = false;
  const {} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubbreaditPayload = {
        subbreaditId,
      };

      const { data } = await axios.post(`/api/subbreadit/subscribe`, payload);
      return data as string;
    },
  });

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">Join to post</Button>
  );
}
