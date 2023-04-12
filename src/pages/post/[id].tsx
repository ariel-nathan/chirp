import { type NextPage } from "next";
import Head from "next/head";

const PostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="absolute inset-0 flex justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex justify-center border-b border-slate-400 p-4">
            Post Page
          </div>
        </div>
      </main>
    </>
  );
};

export default PostPage;
