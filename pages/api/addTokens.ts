// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
});

type Data = {
  session: Stripe.Response<Stripe.Checkout.Session>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession(req, res);
  const user = session?.user;

  const lineItems = [{
    price: process.env.STRIPE_PRODUCT_PRICE_ID,
    quantity: 1,
  }];
  const protocol = process.env.NODE_ENV === 'development' ? 'http://' : 'https://';
  const host = req.headers.host;
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${protocol}${host}/success`,

  })
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

  res.status(200).json({ session: checkoutSession })
}
