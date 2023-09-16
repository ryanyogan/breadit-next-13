import Editor from "@/components/editor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Params {
  params: {
    slug: string;
  };
}

export default async function NewPost({ params }: Params) {
  const sub = await db.subbreadit.findFirst({
    where: {
      name: params.slug,
    },
  });
  if (!sub) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-3 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{params.slug}
          </p>
        </div>
      </div>

      <Editor subbreaditId={sub.id} />

      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="subbreadit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
}
