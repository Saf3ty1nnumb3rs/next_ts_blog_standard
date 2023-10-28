import { AppLayout } from "@/components/AppLayout/AppLayout";
import { getAppProps } from "@/utils/getAppProps";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

export default function NewPost() {
  const router = useRouter();
  const [topic, setTopic] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/generatePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          keywords,
        }),
      });
      const json = await response.json();
      console.log('RESULT: ', json);
      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog on the topic of:</strong>
          </label>
          <textarea
            value={topic}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTopic(e.target.value)}
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
          />
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            value={keywords}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setKeywords(e.target.value)}
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
          />
        </div>
        <button
          className="btn"
          type="submit"
        >
          Generate
        </button>
      </form>
    </div> 
  )
}

NewPost.getLayout = function getLayout(page: React.ReactNode, pageProps: any) {
  return (
    <AppLayout {...pageProps}>
      {page}
    </AppLayout>
  );
}
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
  const req = ctx.req as NextApiRequest; // find a better way; casting sux
  const res = ctx.res as NextApiResponse; // find a better way; casting sux
  const { availableTokens, posts } = await getAppProps(req, res);
  return {
    props: {
      availableTokens,
      posts,
    },
  }
}});
