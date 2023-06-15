import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ResonanceAudioScene } from '~/components/resonance-audio-scene/ResonanceAudioScene';

export default function ResonanceAudioPage() {
  const [showAudioScene, setShowAudioScene] = useState(false);

  useEffect(() => {
    setShowAudioScene(true);
  }, [setShowAudioScene]);

  return (
    <>
      <Head>
        <title>Resonance audio</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {showAudioScene && <ResonanceAudioScene title='Resonance audio' />}
    </>
  );
}
