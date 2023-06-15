import Head from 'next/head';
import { useWebAudioApiService } from '~/services/audio/hooks/use-web-audio-api-service/useWebAudioApiService';
import { AudioScene } from '~/components/audio-scene/AudioScene';

export default function WebAudioApiPage() {
  const { audioRef } = useWebAudioApiService();

  return (
    <>
      <Head>
        <title>Web Audio Api</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AudioScene title='Web Audio API' audioRef={audioRef} />
    </>
  );
}
