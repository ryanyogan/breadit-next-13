import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();
  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subbreadit: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map(
      ({ subbreadit }) => subbreadit.id
    );
  }

  try {
    const { limit, page, subbreaditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subbreaditName: z.string().nullish().optional(),
      })
      .parse({
        subbreaditName: url.searchParams.get("subbreaditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (subbreaditName) {
      whereClause = {
        subbreadit: {
          name: subbreaditName,
        },
      };
    } else if (session) {
      whereClause = {
        subbreadit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subbreadit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not register your vote, please try again.", {
      status: 500,
    });
  }
}
