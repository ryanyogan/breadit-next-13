import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subbreaditSubscriptionValidator } from "@/lib/validators/subbreadit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subbreaditId } = subbreaditSubscriptionValidator.parse(body);

    const subscription = await db.subscription.findFirst({
      where: {
        subbreaditId,
        userId: session.user.id,
      },
    });
    if (!subscription) {
      return new Response("You are not subscribed to this sub.", {
        status: 400,
      });
    }

    const sub = await db.subbreadit.findFirst({
      where: {
        id: subbreaditId,
        creatorId: session.user.id,
      },
    });

    if (sub) {
      return new Response("You made this... cannot unsubscribe", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_subbreaditId: {
          subbreaditId,
          userId: session.user.id,
        },
        // userId: session.user.id,
        // id: subbreaditId,
      },
    });

    return new Response(subbreaditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not unsubscribe, please try again.", {
      status: 500,
    });
  }
}
