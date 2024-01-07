import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useCompareAudioService = (
  selectedLibrary?: SupportedLibrary | 'js-ambisonics-hoa'
) => {
  const { gain, azimuth, elevation } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    import('~/services/audio/compare-audio-service').then(
      ({ CompareAudioService }) => {
        CompareAudioService.getInstance(true);

        return CompareAudioService;
      }
    );
  }, [router]);

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

        audioService?.connectAudioSource(selectedLibrary ?? null);
      }
    );
  }, [selectedLibrary]);

  return { audioRef };
};
