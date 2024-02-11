import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useUserId } from '~/hooks/use-user-id/useUserId';
import '../assets/global.css';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useUserId();

  const setIsPlaying = useSettingsStore((state) => state.setIsPlaying);

  useEffect(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  return (
    <>
      <Head>
        <meta content='3D Audio Web' name='description' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
