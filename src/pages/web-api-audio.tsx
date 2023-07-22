import Head from 'next/head';
import { useWebAudioApiService } from '~/services/audio/hooks/use-web-audio-api-service/useWebAudioApiService';
import { AudioScene } from '~/components/audio-scene/AudioScene';
import { Providers } from '~/components/providers/Providers';
import { useEffect, useState } from 'react';

export default function WebApiAudio() {
  const [showAudioScene, setShowAudioScene] = useState(false);
  const { audioRef } = useWebAudioApiService(showAudioScene);

  useEffect(() => {
    setShowAudioScene(true);
  }, [setShowAudioScene]);

  if (!showAudioScene) return null;

  return (
    <Providers>
      <AudioScene title='Web Audio API' audioRef={audioRef} />
    </Providers>
  );
}
