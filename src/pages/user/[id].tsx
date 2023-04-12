import { type NextPage } from "next";
import Head from "next/head";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>User</title>
        <meta name="User" content="A user page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="absolute inset-0 flex justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex justify-center border-b border-slate-400 p-4">
            <div>User Page</div>
          </div>
          <div>All their posts</div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
