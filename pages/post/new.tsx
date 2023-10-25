import { AppLayout } from "@/components/AppLayout/AppLayout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ChangeEvent, FormEvent, useState } from "react";

export default function NewPost(props: unknown) {
  console.log('NEW POST PROPS: ', props);

  const [topic, setTopic] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [postContent, setPostContent] = useState('');

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
      setPostContent(json.post.postContent);
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
      
      <div
        dangerouslySetInnerHTML={{__html: postContent }}
        className="max-w-screen-sm p-10"
      />
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
  return {
    props: {},
  };
}});