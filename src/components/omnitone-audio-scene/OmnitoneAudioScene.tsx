import React from 'react';
import { AudioScene } from '../audio-scene/AudioScene';
import { useOmnitoneService } from '~/services/audio/hooks/use-omnitone-service/useOmnitoneService';

export const OmnitoneAudioScene = () => {
  const { audioRef } = useOmnitoneService();

  return <AudioScene title={'Omnitone'} audioRef={audioRef} />;
};
