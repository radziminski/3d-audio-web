import Head from 'next/head';
import { useEffect, useState } from 'react';
import { JsAmbisonicsAudioScene } from '~/components/js-ambisonics-audio-scene/JsAmbisonicsAudioScene';

export default function JsAmbisonicsAudioPage() {
  const [showAudioScene, setShowAudioScene] = useState(false);

  useEffect(() => {
    setShowAudioScene(true);
  }, [setShowAudioScene]);

  return (
    <>
      <Head>
        <title>Js Ambisonics audio</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {showAudioScene && <JsAmbisonicsAudioScene />}
    </>
  );
}
