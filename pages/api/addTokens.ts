// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession(req, res);
  const user = session?.user;
  const client = await clientPromise;
  const db = client.db('BlogStandard');
  const userCollection = db.collection('users');

  const userProfile = await userCollection.updateOne({
    auth0Id: user?.sub,
  }, {
    $inc: {
      availableTokens: 10,
    },
    $setOnInsert: {
      auth0Id: user?.sub,
    },
  }, {
    upsert: true,
  }
  );
  console.log(user);

  res.status(200).json({ name: 'John Doe' })
}
