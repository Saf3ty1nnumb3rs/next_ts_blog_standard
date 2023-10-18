import { AppPropsWithLayout } from '@/@types/Layout';
import '@/styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page);
  return (
    <UserProvider>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </UserProvider>
  );
}
