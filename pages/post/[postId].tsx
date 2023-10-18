import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Post() {
  return (
    <div>
      This is the Post Page
    </div> 
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
  return {
    props: {},
  };
}});
