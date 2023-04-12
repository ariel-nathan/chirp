import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

dayjs.extend(relativeTime);

const PostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data } = api.posts.getById.useQuery({
    postId,
  });

  if (!data) return <div>404 Post not found!</div>;

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full md:max-w-2xl">
          <div className="sticky top-0 flex h-20 w-full items-center justify-between gap-4 border border-slate-400 bg-black p-4">
            <Link href="/">
              <button className="border border-slate-400 p-2 text-xl font-bold text-slate-400 hover:border-slate-500 hover:text-slate-500">
                &lsaquo;
              </button>
            </Link>
            <div className="truncate text-slate-400">{postId}</div>
            <div></div>
          </div>
          <div className="flex flex-col justify-center gap-4 border border-slate-400 p-8 hover:border-slate-600">
            <div className="w-fit text-slate-300">
              <Link href={`/user/${data.author?.id}`}>
                <div className="truncate hover:text-slate-400">
                  {data.author.id}
                </div>
              </Link>
              <div className="text-sm text-slate-500">
                {dayjs(data.post.createdAt).fromNow()}
              </div>
            </div>

            <div className="text-2xl">{data.post.content}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const postId = context.params?.id;

  if (typeof postId !== "string") throw new Error("No id");

  await ssg.posts.getById.prefetch({ postId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default PostPage;
