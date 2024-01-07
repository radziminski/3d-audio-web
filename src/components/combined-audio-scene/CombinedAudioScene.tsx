import React from 'react';
import { AudioScene } from '../audio-scene/AudioScene';
import { useCompareAudioService } from '~/services/audio/hooks/use-compare-audio-service/useCompareAudioService';
import { useTestStore } from '~/store/settings/useTestStore';

export const CombinedAudioScene = () => {
  const currentLibrary = useTestStore((state) => state.currentLibrary);

  const { audioRef } = useCompareAudioService(currentLibrary, currentLibrary);

  return <AudioScene audioRef={audioRef} title='Combined' />;
};
