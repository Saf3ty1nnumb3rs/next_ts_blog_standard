import { AppLayout } from "@/components/AppLayout/AppLayout";
import { getAppProps } from "@/utils/getAppProps";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { MouseEvent, useCallback } from "react";

export default function TokenTopup() {
  const handleSubmit = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/addTokens`, {
      method: 'POST',
    });
    const json = await response.json();
    console.log("RESULT: ", json);
    window.location.href = json?.session.url;
  }, [])
  return (
    <div>
      <h1>This is the Token Topup Page</h1>
      <button className="btn" onClick={handleSubmit}>Add Tokens</button>
    </div> 
  )
}

TokenTopup.getLayout = function getLayout(page: React.ReactNode, pageProps: any) {
  return (
    <AppLayout {...pageProps}>
      {page}
    </AppLayout>
  );
}
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { availableTokens, posts } = await getAppProps(ctx);
    return {
      props: {
        availableTokens,
        posts,
      },
    }
  }
});
