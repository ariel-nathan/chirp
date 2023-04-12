import { LoadingSpinner } from "@/components/Loading";
import { PostView } from "@/components/PostView";
import { api } from "@/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
    <main className="flex h-screen justify-center">
      <div className="w-full md:max-w-2xl">
        <div className="sticky top-0 flex h-20 w-full justify-center border border-slate-400 bg-black p-4">
          {!isSignedIn && (
            <div className="flex justify-center border border-slate-400 p-2 text-slate-400 hover:border-slate-500 hover:text-slate-500">
              <SignInButton />
            </div>
          )}
          {isSignedIn && (
            <div className="flex w-full justify-between gap-5">
              <CreatePostWizard />
              <div className="flex justify-center border border-slate-400 p-2 text-slate-400 hover:border-slate-500 hover:text-slate-500">
                <SignOutButton />
              </div>
            </div>
          )}
        </div>
        <Feed />
      </div>
    </main>
  );
};

export default Home;
