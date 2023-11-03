import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useUserId } from '~/hooks/use-user-id/useUserId';
import '../assets/global.css';

export default function App({ Component, pageProps }: AppProps) {
  useUserId();

  return (
    <>
      <Head>
        <meta content='Agency Sales Flow' name='description' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
