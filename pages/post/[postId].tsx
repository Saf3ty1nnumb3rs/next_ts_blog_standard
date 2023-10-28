import { AppLayout } from "@/components/AppLayout/AppLayout";
import clientPromise from "@/lib/mongodb";
import { getAppProps } from "@/utils/getAppProps";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ReactNode } from "react";

const SectionHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
      {children}
    </div>
  );
};
export default function Post(props: Post) {
  console.log(props);
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <SectionHeader>
          SEO title and meta description
        </SectionHeader>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div
            className="text-blue-600 text-2xl font-bold"
          >
            {props.title}
          </div>
          <div
            className="mt-2"
          >
            {props.metaDescription}
          </div>
        </div>
        <SectionHeader>
          Keywords
        </SectionHeader>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords && props.keywords.split(',').map((keyword: string, i) => (
            <div
              key={`${keyword}-${i}`}
              className="p-2 rounded-full bg-slate-800 text-white"
            >
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <SectionHeader>
          Blog Post
        </SectionHeader>
        <div dangerouslySetInnerHTML={{ __html: props.postContent || '' }} />
      </div>
    </div> 
  )
}

Post.getLayout = function getLayout(page: React.ReactNode, pageProps: any) {
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
    const { userSession, client, db, user, ...props } = await getAppProps(req, res);
    const postParam = String(ctx.params?.postId ?? '');
    const post = await db?.collection('posts').findOne({
      _id: new ObjectId(postParam),
      userId: user?._id,
    });
    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false,
        },
      }
    }
  return {
    props: {
      postContent: post.postContent,
      title: post.title,
      metaDescription: post.metaDescription,
      keywords: post.keywords,
      ...props
    },
  };
}});
