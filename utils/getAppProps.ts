import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export const getAppProps = async (req: NextApiRequest, res: NextApiResponse) => {
  const userSession = await getSession(req, res);
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
  }).toArray();

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
  }
};
