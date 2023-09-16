import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { postValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subbreaditId, title, content } = postValidator.parse(body);

    const subscription = await db.subscription.findFirst({
      where: {
        subbreaditId,
        userId: session.user.id,
      },
    });
    if (!subscription) {
      return new Response("Subscribe to the post first", {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        subbreaditId,
        title,
        content,
        authorId: session.user.id,
      },
    });

    return new Response("Created", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not post, please try again.", {
      status: 500,
    });
  }
}
