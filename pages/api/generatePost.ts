// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from '@/lib/mongodb';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';

type Post = {
  postContent: string,
  title: string,
  metaDescription: string,
}
interface Data {
  post: Post
}

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession(req, res); 
  const user = session?.user;

  const client = await clientPromise;
  const db = client.db('BlogStandard');

  const userCollection = db.collection('users');
  const userProfile = await userCollection.findOne({
    auth0Id: user?.sub,
  });
  console.log(userProfile)
  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { topic, keywords } = req.body;

  try {
    const postContentResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'You are a blog post generator',
        },
        {
          role: 'user',
          content: `Write a long and detailed SEO-optimized blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
          The content should be formatted in SEO-optimized HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`
        },
      ]
    })
    const postContent = postContentResponse.choices[0]?.message?.content ?? '';
    const titleResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'You are a blog post generator',
        },
        {
          role: 'user',
          content: `Write a long and detailed SEO-optimized blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
          The content should be formatted in SEO-optimized HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`
        },
        {
          role: 'assistant',
          content: postContent,
        },
        {
          role: 'user',
          content: 'Generate appropriate title tag text for the above blog post',
        },
      ]
    })
    const metaResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'You are a blog post generator',
        },
        {
          role: 'user',
          content: `Write a long and detailed SEO-optimized blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
          The content should be formatted in SEO-optimized HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`
        },
        {
          role: 'assistant',
          content: postContent,
        },
        {
          role: 'user',
          content: 'Generate SEO-friendly meta description content for the above blog post',
        },
      ]
    })
    const title = titleResponse.choices[0]?.message?.content ?? '';
    const metaDescription = metaResponse.choices[0]?.message?.content ?? '';

    await userCollection.updateOne({
      auth0Id: user?.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    });

    const post = await db.collection('posts').insertOne({
      postContent,
      title,
      metaDescription,
      topic,
      keywords,
      userId: userProfile?._id,
      created: new Date(),
    });
    res.status(200).json({
      post: {
        postContent,
        title,
        metaDescription,
      }})
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);
      console.error(error.message);
      console.error(error.code);
      console.error(error.type);
    }
  }
});



// The content should be formatted in SEO-optimized HTML. The response must also include appropriate HTML title and meta description content.
//       The return format must be stringified JSON in the following format
