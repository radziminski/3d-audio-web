import Head from 'next/head';
import { Poppins } from 'next/font/google';
import { Button, Center, createStyles } from '@mantine/core';
import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '800'],
  subsets: ['latin'],
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'linear-gradient(to bottom right, #49BCF6 , #49DEB2)',
    width: '100%',
    height: '100vh',
    fontFamily: 'var(--font-poppins)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  dialog: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '18px',
    maxWidth: 700,
    maxHeight: '80%',
    width: '100%',
    height: '100%',
    padding: ' 64px 48px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const router = useRouter();
  const [isResonance, setIsResonance] = useState(false);
  const [isWebAudio, setIsWebAudio] = useState(false);
  const [isOmnitone, setIsOmnitone] = useState(false);
  const [isJsAmbisonics, setIsJsAmbisonics] = useState(false);

  useEffect(() => {
    if (!isResonance) {
      return;
    }
    import('~/services/audio/resonance-audio').then(
      ({ ResonanceAudioService }) => {
        (window as any).as = ResonanceAudioService.getInstance(true);
        router.push('./resonance-audio');
      }
    );
  }, [isResonance, router]);

  useEffect(() => {
    if (!isWebAudio) {
      return;
    }
    import('~/services/audio/web-audio-api').then(({ WebAudioApiService }) => {
      (window as any).as = WebAudioApiService.getInstance(true);
      router.push('./web-audio-api');
    });
  }, [isWebAudio, router]);

  useEffect(() => {
    if (!isOmnitone) {
      return;
    }
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      (window as any).as = OmnitoneService.getInstance(true);
      router.push('./omnitone-audio');
    });
  }, [isOmnitone, router]);

  useEffect(() => {
    if (!isJsAmbisonics) {
      return;
    }
    import('~/services/audio/js-ambisonics').then(
      ({ JsAmbisonicsAudioService }) => {
        (window as any).as = JsAmbisonicsAudioService.getInstance(true);
        router.push('./js-ambisonics-audio');
      }
    );
  }, [isJsAmbisonics, router]);

  const handleStartWebAudio = useCallback(() => {
    setIsWebAudio(true);
  }, []);

  const handleStartResonance = useCallback(() => {
    setIsResonance(true);
  }, []);

  const handleStartOmnitone = useCallback(() => {
    setIsOmnitone(true);
  }, []);

  const handleStartJsAmbisonics = useCallback(() => {
    setIsJsAmbisonics(true);
  }, []);

  return (
    <>
      <Head>
        <title>3D Web Audio</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Providers>
        <main className={poppins.className}>
          <Center className={classes.wrapper}>
            <Button onClick={handleStartWebAudio}>Web Audio Api</Button>
            <Button onClick={handleStartResonance}>Resonance audio</Button>
            <Button onClick={handleStartOmnitone}>Omnitone</Button>
            <Button onClick={handleStartJsAmbisonics}>Js Ambisonics</Button>
          </Center>
        </main>
      </Providers>
    </>
  );
}
