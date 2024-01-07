import React from 'react';
import { AudioScene } from '../audio-scene/AudioScene';
import { useJsAmbisonicsHoaAudioService } from '~/services/audio/hooks/use-js-ambisonics-hoa-audio-service/useJsAmbisonicsHoaAudioService';
// import { useJsAmbisonicsAudioService } from '~/services/audio/hooks/use-js-ambisonics-audio-service/useJsAmbisonicsAudioService';

export const JsAmbisonicsAudioScene = () => {
  // const { audioRef } = useJsAmbisonicsAudioService();
  const { audioRef } = useJsAmbisonicsHoaAudioService();

  return <AudioScene audioRef={audioRef} title='JS ambisonics' />;
};
