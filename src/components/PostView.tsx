import { type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <Link href={`/post/${post.id}`}>
      <div className="flex flex-col justify-center gap-4 border border-slate-400 p-8 hover:border-slate-600">
        <div className="w-fit text-slate-300">
          <Link href={`/user/${author?.id}`}>
            <div className="truncate hover:text-slate-400">{author.id}</div>
          </Link>
          <div className="text-sm text-slate-500">
            {dayjs(post.createdAt).fromNow()}
          </div>
        </div>

        <div className="text-2xl">{post.content}</div>
      </div>
    </Link>
  );
};
