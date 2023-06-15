import React from 'react';
import { AudioScene } from '../audio-scene/AudioScene';
import { useResonanceAudioService } from '~/services/audio/hooks/use-resonance-audio-service/useResonanceAudioService';

export const ResonanceAudioScene = () => {
  const { audioRef } = useResonanceAudioService();

  return <AudioScene title='Omnitone Audio' audioRef={audioRef} />;
};
