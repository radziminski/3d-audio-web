import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';

export const useCompareAudioService = (
  selectedLibrary?: SupportedLibrary,
  defaultLibrary?: SupportedLibrary
) => {
  const {
    gain,
    azimuth,
    elevation,
    isBypassed,
    appMode,
    isMachLoading,
    audioSource,
    isPlaying,
    setIsMachLoading,
  } = useSettingsStore();
  const { guessType } = useTestStore();

  const setGain = useSettingsStore((state) => state.setGain);
  const isReference = useSettingsStore((state) => state.isReference);

  const audioRef = useRef<HTMLAudioElement>(null);

  // const machPlay = useRef<() => void>();
  // const machPause = useRef<() => void>();

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

        console.log('true angles (azimuth, elevation)', azimuth, elevation);
        console.log('guessType', guessType);
      }
    );
  }, [azimuth, elevation]);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();

        if (selectedLibrary === 'mach1') {
          setTimeout(() => {
            audioService?.setOutputGain(gain / 100);
          }, 500);

          return;
        }
        audioService?.setOutputGain(gain / 100);
      }
    );
  }, [gain, selectedLibrary]);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();

        if (isBypassed || guessType === 'bypassed') {
          audioService?.connectAudioSource(null);

          return;
        }

        if (guessType === 'left-only' || guessType === 'right-only') {
          if (selectedLibrary === 'mach1') {
            audioService?.setDirection({
              azimuth: guessType === 'left-only' ? 270 : 90,
              elevation: 0,
            });

            return;
          }

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
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();

        if (guessType === 'left-only' || guessType === 'right-only') {
          if (selectedLibrary === 'mach1') {
            if (isReference) {
              audioService?.setDirection({
                azimuth: 0,
                elevation: 0,
              });

              return;
            }

            audioService?.setDirection({
              azimuth: guessType === 'left-only' ? 270 : 90,
              elevation: 0,
            });

            return;
          }

          if (isReference) {
            audioService?.setPanner('center');
            return;
          }

          audioService?.setPanner(guessType);
        }
      }
    );
  }, [selectedLibrary, guessType, isReference]);

  useEffect(() => {
    setGain(65);
  }, [setGain]);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();

        setIsMachLoading(true);
        audioService?.setSourceForMach(audioSource, () => {
          setIsMachLoading(false);
        });
      }
    );
  }, [audioSource, setIsMachLoading]);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        const audioService = CompareAudioService.getInstance();
        const wasPlaying = isPlaying;

        if (selectedLibrary === 'mach1') {
          if (wasPlaying) {
            if (!isMachLoading) {
              setTimeout(() => {
                // @ts-expect-error
                window.controls?.play();
              }, 100);
            }
          }
          // machPlay.current = audioService?.machPlay;
          // machPause.current = audioService?.machPause;
        } else {
          audioService?.machPause();

          if (wasPlaying) {
            setTimeout(() => {
              audioRef.current?.play();
            }, 100);

            return;
          }
        }
      }
    );
  }, [audioSource, selectedLibrary, setIsMachLoading, isMachLoading]);

  // @ts-expect-error
  const machPause = window.controls?.pause;

  // @ts-expect-error
  const machPlay = window.controls?.play;

  return { audioRef, machPause, machPlay };
};
