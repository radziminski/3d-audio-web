import { useEffect, useLayoutEffect, useRef } from 'react';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';

export const useCompareAudioService = (
  selectedLibrary?: SupportedLibrary,
  defaultLibrary?: SupportedLibrary
) => {
  const { gain, azimuth, elevation, isBypassed, appMode } = useSettingsStore();
  const { guessType } = useTestStore();

  const setGain = useSettingsStore((state) => state.setGain);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        CompareAudioService.getInstance(true, defaultLibrary);

        return CompareAudioService;
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        if (audioRef.current && CompareAudioService.checkIsInitialized()) {
          const audioService = CompareAudioService.getInstance();

          if (audioService?.isAudioElementLinked()) {
            console.log('Audio element already linked');
            return;
          }

          audioService?.linkAudioElement(audioRef.current);
        }
      }
    );
  }, [audioRef.current]);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();

        audioService?.setDirection({ azimuth, elevation });
      }
    );
  }, [azimuth, elevation]);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();

        audioService?.setOutputGain(gain / 100);
      }
    );
  }, [gain]);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();

        if (isBypassed || guessType === 'bypassed') {
          audioService?.connectAudioSource(null);

          return;
        }

        if (guessType === 'left-only' || guessType === 'right-only') {
          audioService?.connectAudioSource('stereo-panner');
          audioService?.setPanner(guessType);
          return;
        }

        audioService?.connectAudioSource(selectedLibrary ?? null);

        return;
      }
    );
  }, [selectedLibrary, isBypassed, guessType, appMode]);

  useEffect(() => {
    setGain(65);
  }, [setGain]);

  return { audioRef };
};
