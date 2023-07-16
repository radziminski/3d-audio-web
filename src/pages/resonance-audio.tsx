import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Providers } from '~/components/providers/Providers';
import { ResonanceAudioScene } from '~/components/resonance-audio-scene/ResonanceAudioScene';

export default function ResonanceAudioPage() {
  const [showAudioScene, setShowAudioScene] = useState(false);

  useEffect(() => {
    setShowAudioScene(true);
  }, [setShowAudioScene]);

  return <Providers>{showAudioScene && <ResonanceAudioScene />}</Providers>;
}
