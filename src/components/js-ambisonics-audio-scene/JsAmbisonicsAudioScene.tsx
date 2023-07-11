import React from 'react';
import { AudioScene } from '../audio-scene/AudioScene';
import { useJsAmbisonicsAudioService } from '~/services/audio/hooks/use-js-ambisonics-audio-service/useJsAmbisonicsAudioService';

export const JsAmbisonicsAudioScene = () => {
  const { audioRef } = useJsAmbisonicsAudioService();

  return <AudioScene audioRef={audioRef} title='JS ambisonics' />;
};
