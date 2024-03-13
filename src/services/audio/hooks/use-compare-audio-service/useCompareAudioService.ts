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
    appMode,
    isMachLoading,
    audioSource,
    isPlaying,
    azimuth,
    elevation,
    setAudioSource,
    setIsMachLoading,
    setAngles,
  } = useSettingsStore();
  const { guessType, currentAngle } = useTestStore();

  const setGain = useSettingsStore((state) => state.setGain);

  const audioRef = useRef<HTMLAudioElement>(null);

  // const machPlay = useRef<() => void>();
  // const machPause = useRef<() => void>();

  useEffect(() => {
    if (currentAngle) {
      setAngles(currentAngle?.azimuth, currentAngle?.elevation);
    }
  }, [currentAngle, setAngles]);

  useEffect(() => {
    if (
      appMode !== 'playground' &&
      currentAngle &&
      currentAngle.sample !== audioSource
    ) {
      setAudioSource(currentAngle.sample);
    }
  }, [appMode, audioSource, currentAngle, setAudioSource]);

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

        audioService?.setDirection({
          azimuth,
          elevation,
        });

        console.log('true angles (azimuth, elevation)', azimuth, elevation);
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

        audioService?.connectAudioSource(selectedLibrary ?? null);

        return;
      }
    );
  }, [selectedLibrary, guessType, appMode]);

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
