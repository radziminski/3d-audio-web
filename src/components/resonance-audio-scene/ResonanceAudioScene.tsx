import React from 'react';
import { AudioScene } from '../audio-scene/AudioScene';
import { useResonanceAudioService } from '~/services/audio/hooks/use-resonance-audio-service/useResonanceAudioService';

type Props = {
  title: string;
};

export const ResonanceAudioScene = ({ title }: Props) => {
  const { audioRef } = useResonanceAudioService();

  return <AudioScene title={title} audioRef={audioRef} />;
};
