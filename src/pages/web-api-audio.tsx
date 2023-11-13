import Head from 'next/head';
import { useWebAudioApiService } from '~/services/audio/hooks/use-web-audio-api-service/useWebAudioApiService';
import { AudioScene } from '~/components/audio-scene/AudioScene';
import { Providers } from '~/components/providers/Providers';
import { useEffect, useState } from 'react';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

export default function WebApiAudio() {
  const isClientRender = useClientRender();

  const { audioRef } = useWebAudioApiService(isClientRender);

  if (!isClientRender) return null;

  return (
    <Providers>
      <AudioScene title='Web Audio API' audioRef={audioRef} />
    </Providers>
  );
}
