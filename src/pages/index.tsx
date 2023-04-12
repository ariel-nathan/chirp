import { LoadingSpinner } from "@/components/Loading";
import { api, type RouterOutputs } from "@/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const [input, setInput] = useState("");

  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again.");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex gap-2">
      <input
        placeholder="Type some emojis"
        className="border border-slate-400 bg-transparent p-2 focus:outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({
                content: input,
              });
            }
          }
        }}
      />
      {input !== "" ? (
        <button
          className={`flex items-center justify-center border border-slate-400 p-2 font-bold ${
            isPosting ? "border-slate-600 text-slate-600" : ""
          }`}
          disabled={isPosting}
          onClick={() =>
            mutate({
              content: input,
            })
          }
        >
          &rsaquo;
        </button>
      ) : (
        <button className="flex cursor-not-allowed items-center justify-center border border-slate-600 p-2 font-bold text-slate-600">
          &rsaquo;
        </button>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <Link href={`/post/${post.id}`}>
      <div className="flex flex-col justify-center gap-4 border border-slate-400 p-8 hover:border-slate-800">
        <div className="w-fit text-slate-200">
          <Link href={`/user/${author.id}`}>
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

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingSpinner />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching posts ASAP
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div></div>;

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="Chirp" content="The Chirp homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="absolute inset-0 flex justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex justify-center border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center border border-slate-400 p-2">
                <SignInButton />
              </div>
            )}
            {isSignedIn && (
              <div className="flex w-full justify-between gap-5">
                <CreatePostWizard />
                <div className="flex justify-center border border-slate-400 p-2">
                  <SignOutButton />
                </div>
              </div>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
