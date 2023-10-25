// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';

type Data = {
  post: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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
    const meta = metaResponse.choices[0]?.message?.content ?? '';
    console.log('POST: ', postContent);
    console.log('TITLE: ', title);
    console.log('META: ', meta);
    res.status(200).json({ post: postContent })
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);
      console.error(error.message);
      console.error(error.code);
      console.error(error.type);
    }
  }
}

// The content should be formatted in SEO-optimized HTML. The response must also include appropriate HTML title and meta description content.
//       The return format must be stringified JSON in the following format
