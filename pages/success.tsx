import { AppLayout } from "@/components/AppLayout/AppLayout";
import { getAppProps } from "@/utils/getAppProps";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Success() {
  return (
    <div>
      <h1>Thank you for your purchase</h1>
    </div> 
  )
}

Success.getLayout = function getLayout(page: React.ReactNode, pageProps: any) {
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
