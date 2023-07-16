import Head from 'next/head';
import { useWebAudioApiService } from '~/services/audio/hooks/use-web-audio-api-service/useWebAudioApiService';
import { AudioScene } from '~/components/audio-scene/AudioScene';
import { Providers } from '~/components/providers/Providers';

export default function WebAudioApiPage() {
  const { audioRef } = useWebAudioApiService();

  return (
    <Providers>
      <AudioScene title='Web Audio API' audioRef={audioRef} />
    </Providers>
  );
}
