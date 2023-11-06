import clientPromise from "@/lib/mongodb";
import { IGetAppProps, IPostDocument } from "@/types";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

export const getAppProps =
  async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>): Promise<IGetAppProps> => {
  const userSession = await getSession(ctx.req, ctx.res); // auth0
  const client = await clientPromise;
  const db = client.db("BlogStandard");
  const user = await db.collection("users").findOne({
    auth0Id: userSession?.user?.sub,
  });
  if (!user) {
    return {
      availableTokens: 0,
      posts: [],
    }
  }
  const posts = await db.collection("posts").find({
    userId: user._id,
  }).sort({ created: -1 }).toArray() as IPostDocument[];
  const postId: string = String(ctx.params?.postId ?? '');
  return {
    userSession,
    client,
    db,
    user,
    availableTokens: user.availableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      created: created.toString(),
      ...rest,
    })),
    postId: postId ?? null,
  }
};
