import MiniCreatePost from "@/components/mini-create-post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Params {
  params: {
    slug: string;
  };
}

export default async function Subbreadit({ params }: Params) {
  const { slug } = params;
  const session = await getAuthSession();

  const subbreadit = await db.subbreadit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subbreadit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subbreadit) {
    return notFound();
  }

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subbreadit.name}
      </h1>
      <MiniCreatePost session={session} />
    </>
  );
}
