import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function TokenTopup() {
  return (
    <div>
      This is the Token Topup Page
    </div> 
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
  return {
    props: {},
  };
}});
