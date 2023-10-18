import { AppLayout } from "@/components/AppLayout/AppLayout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function TokenTopup() {
  return (
    <div>
      This is the Token Topup Page
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
