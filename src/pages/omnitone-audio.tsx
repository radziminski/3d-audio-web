import Head from 'next/head';
import { useEffect, useState } from 'react';
import { OmnitoneAudioScene } from '~/components/omnitone-audio-scene/OmnitoneAudioScene';

export default function OmnitoneAudioPage() {
  const [showAudioScene, setShowAudioScene] = useState(false);

  useEffect(() => {
    setShowAudioScene(true);
  }, [setShowAudioScene]);

  return (
    <>
      <Head>
        <title>Omnitone audio</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {showAudioScene && <OmnitoneAudioScene />}
    </>
  );
}
