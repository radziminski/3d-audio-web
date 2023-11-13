import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Providers } from '~/components/providers/Providers';
import { ResonanceAudioScene } from '~/components/resonance-audio-scene/ResonanceAudioScene';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

export default function ResonanceAudioPage() {
  const isClientRender = useClientRender();

  return <Providers>{isClientRender && <ResonanceAudioScene />}</Providers>;
}
