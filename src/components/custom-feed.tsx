import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostFeed from "./post-feed";

export default async function CustomFeed() {
  const session = await getAuthSession();

  const communites = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subbreadit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subbreadit: {
        name: {
          in: communites.map(({ subbreadit }) => subbreadit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      votes: true,
      comments: true,
      subbreadit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
}
