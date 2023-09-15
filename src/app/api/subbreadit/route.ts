import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subbreaditValidator } from "@/lib/validators/subbreadit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = subbreaditValidator.parse(body);

    const subbreaditExists = await db.subbreadit.findFirst({
      where: { name },
    });

    if (subbreaditExists) {
      return new Response("Subbreadit already exists", { status: 409 });
    }

    const subbreadit = await db.subbreadit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subbreaditId: subbreadit.id,
      },
    });

    return new Response(subbreadit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create subbreadit", { status: 500 });
  }
}
