import { AppLayout } from "@/components/AppLayout/AppLayout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { MouseEvent, MouseEventHandler, useCallback } from "react";

export default function TokenTopup() {
  const handleSubmit = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/addTokens`, {
      method: 'POST',
    });
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
  return {
    props: {},
  };
}});
