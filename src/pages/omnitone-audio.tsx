import Head from 'next/head';
import { AudioScene } from '~/components/audio-scene/AudioScene';
import { useResonanceAudioService } from '~/services/audio/hooks/use-resonance-audio-service/useResonanceAudioService';

export default function OmnitoneAudioPage() {
  const { audioRef } = useResonanceAudioService();

  return (
    <>
      <Head>
        <title>Omnitone audio</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AudioScene title='Omnitone Audio' audioRef={audioRef} />
    </>
  );
}
