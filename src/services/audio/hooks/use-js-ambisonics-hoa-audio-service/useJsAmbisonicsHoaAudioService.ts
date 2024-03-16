import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { SOURCES_COUNT } from '~/components/eval/eval.constants';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useJsAmbisonicsHoaAudioService = () => {
  const { gain, azimuth, elevation } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect(() => {
  //   import('~/services/audio/js-ambisonics-hoa').then(
  //     ({ JsAmbisonicsHoaAudioService }) => {
  //       if (!JsAmbisonicsHoaAudioService.checkIsInitialized()) {
  //         router.push('/library-redirect?library=js-ambisonics');
  //       }
  //     }
  //   );
  // }, [router]);

  useLayoutEffect(() => {
    import('~/services/audio/js-ambisonics-hoa').then(
      ({ JsAmbisonicsHoaAudioService }) => {
        if (JsAmbisonicsHoaAudioService.checkIsInitialized()) {
          const audioService = JsAmbisonicsHoaAudioService.getInstance();

          audioService
            ?.createAndConnectSources(SOURCES_COUNT, '/guitar.mp3')
            .then(() => {
              audioService?.playAllSources();
            });
        }
      }
    );
  });

  // useLayoutEffect(() => {
  //   import('~/services/audio/js-ambisonics-hoa').then(
  //     ({ JsAmbisonicsHoaAudioService }) => {
  //       if (
  //         audioRef.current &&
  //         JsAmbisonicsHoaAudioService.checkIsInitialized()
  //       ) {
  //         const audioService = JsAmbisonicsHoaAudioService.getInstance();

  //         if (audioService?.isAudioElementLinked()) {
  //           return;
  //         }

  //         audioService?.linkAudioElement(audioRef.current);
  //       }
  //     }
  //   );
  // }, []);

  useEffect(() => {
    import('~/services/audio/js-ambisonics-hoa').then(
      ({ JsAmbisonicsHoaAudioService }) => {
        const audioService = JsAmbisonicsHoaAudioService.getInstance();

        audioService?.setDirection({ azimuth: -azimuth, elevation });
      }
    );
  }, [azimuth, elevation]);

  useEffect(() => {
    import('~/services/audio/js-ambisonics-hoa').then(
      ({ JsAmbisonicsHoaAudioService }) => {
        const audioService = JsAmbisonicsHoaAudioService.getInstance();

        audioService?.setOutputGain(gain / 100);
      }
    );
  }, [gain]);

  return { audioRef };
};
