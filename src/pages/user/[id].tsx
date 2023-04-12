import { LoadingSpinner } from "@/components/Loading";
import { PostView } from "@/components/PostView";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!data || data.length === 0) return <div>User has no posts!</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    userId,
  });

  if (!data) return <div>404 User not found!</div>;

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full md:max-w-2xl">
          <div className="sticky top-0 flex h-20 w-full items-center justify-between gap-4 border border-slate-400 bg-black p-4">
            <Link href="/">
              <button className="border border-slate-400 p-2 text-xl font-bold text-slate-400 hover:border-slate-500 hover:text-slate-500">
                &lsaquo;
              </button>
            </Link>
            <div className="truncate text-slate-400">{userId}</div>
            <div></div>
          </div>
          <ProfileFeed userId={userId} />
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const userId = context.params?.id;

  if (typeof userId !== "string") throw new Error("No userId");

  await ssg.profile.getUserByUsername.prefetch({ userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
