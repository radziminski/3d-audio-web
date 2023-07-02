import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useJsAmbisonicsAudioService = () => {
  const { gain, azimuth, elevation } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    import('~/services/audio/js-ambisonics').then(
      ({ JsAmbisonicsAudioService }) => {
        if (!JsAmbisonicsAudioService.checkIsInitialized()) {
          router.push('/');
        }
      }
    );
  }, [router]);

  useLayoutEffect(() => {
    import('~/services/audio/js-ambisonics').then(
      ({ JsAmbisonicsAudioService }) => {
        if (audioRef.current && JsAmbisonicsAudioService.checkIsInitialized()) {
          const audioService = JsAmbisonicsAudioService.getInstance();

          if (audioService?.isAudioElementLinked()) {
            return;
          }

          audioService?.linkAudioElement(audioRef.current);
        }
      }
    );
  }, []);

  useEffect(() => {
    import('~/services/audio/js-ambisonics').then(
      ({ JsAmbisonicsAudioService }) => {
        const audioService = JsAmbisonicsAudioService.getInstance();

        audioService?.setDirection({ azimuth: -azimuth, elevation });
      }
    );
  }, [azimuth, elevation]);

  useEffect(() => {
    import('~/services/audio/js-ambisonics').then(
      ({ JsAmbisonicsAudioService }) => {
        const audioService = JsAmbisonicsAudioService.getInstance();

        audioService?.setOutputGain(gain / 100);
      }
    );
  }, [gain]);

  return { audioRef };
};
