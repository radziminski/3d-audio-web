import Head from 'next/head';
import { useEffect, useState } from 'react';
import { OmnitoneAudioScene } from '~/components/omnitone-audio-scene/OmnitoneAudioScene';
import { Providers } from '~/components/providers/Providers';

export default function OmnitoneAudioPage() {
  const [showAudioScene, setShowAudioScene] = useState(false);

  useEffect(() => {
    setShowAudioScene(true);
  }, [setShowAudioScene]);

  return <Providers>{showAudioScene && <OmnitoneAudioScene />}</Providers>;
}
