import { useEffect, useState } from 'react';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useCompareAudioService } from '~/services/audio/hooks/use-compare-audio-service/useCompareAudioService';
import { AudioSettings } from '../audio-settings/AudioSettings';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const Compare = () => {
  const setAppMode = useSettingsStore((state) => state.setAppMode);

  const [selectedLibrary, setSelectedLibrary] = useState<
    SupportedLibrary | 'js-ambisonics-hoa'
  >();
  const { audioRef } = useCompareAudioService(selectedLibrary);

  useEffect(() => {
    setAppMode('playground');
  }, [setAppMode]);

  return (
    <div>
      <button onClick={() => setSelectedLibrary('web-api')}>
        Web Audio API
      </button>
      <button onClick={() => setSelectedLibrary('js-ambisonics')}>
        JS Ambisonics
      </button>
      <button onClick={() => setSelectedLibrary('js-ambisonics-hoa')}>
        JS Ambisonics Hoa
      </button>
      <button onClick={() => setSelectedLibrary('resonance')}>Resonance</button>
      <button onClick={() => setSelectedLibrary('omnitone')}>Omnitone</button>

      <AudioSettings audioRef={audioRef} />
    </div>
  );
};
