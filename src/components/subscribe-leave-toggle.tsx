"use client";

import useCustomToast from "@/hooks/use-custom-toast";
import { SubscribeToSubbreaditPayload } from "@/lib/validators/subbreadit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface Props {
  subbreaditId: string;
  subbreaditName: string;
  isSubscribed: boolean;
}

export default function SubscribeLeaveToggle({
  subbreaditId,
  subbreaditName,
  isSubscribed,
}: Props) {
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubbreaditPayload = {
        subbreaditId,
      };

      const { data } = await axios.post(`/api/subbreadit/subscribe`, payload);
      return data as string;
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
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subbreaditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubbreaditPayload = {
        subbreaditId,
      };

      const { data } = await axios.post(`/api/subbreadit/unsubscribe`, payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }

        if (err.response?.status === 400) {
          return toast({
            title: "There was a problem.",
            description: "Why are you trying to unsub to what you made?!",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "There was a problem.",
        description: "Something blew up, small though",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now un-subscribed to r/${subbreaditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
}
