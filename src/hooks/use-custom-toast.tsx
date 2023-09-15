import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function useCustomToast() {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to perform that action.",
      variant: "destructive",
      action: (
        <Link
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
          href="/sign-in"
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
}
