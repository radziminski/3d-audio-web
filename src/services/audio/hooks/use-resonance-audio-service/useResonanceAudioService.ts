import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { SOURCES_COUNT } from '~/components/eval/eval.constants';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useResonanceAudioService = () => {
  const { gain, sourcePosition } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect(() => {
  //   import('~/services/audio/resonance-audio').then(
  //     ({ ResonanceAudioService }) => {
  //       if (!ResonanceAudioService.checkIsInitialized()) {
  //         router.push('/library-redirect?library=resonance');
  //       }
  //     }
  //   );
  // }, [router]);

  useLayoutEffect(() => {
    import('~/services/audio/resonance-audio').then(
      ({ ResonanceAudioService }) => {
        console.log(ResonanceAudioService);
        if (ResonanceAudioService.checkIsInitialized()) {
          const audioService = ResonanceAudioService.getInstance();

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
  //   import('~/services/audio/resonance-audio').then(
  //     ({ ResonanceAudioService }) => {
  //       if (audioRef.current && ResonanceAudioService.checkIsInitialized()) {
  //         const audioService = ResonanceAudioService.getInstance();

  //         if (audioService?.isAudioElementLinked()) {
  //           return;
  //         }

  //         audioService?.linkAudioElement(audioRef.current);
  //       }
  //     }
  //   );
  // }, []);

  useEffect(() => {
    import('~/services/audio/resonance-audio').then(
      ({ ResonanceAudioService }) => {
        const audioService = ResonanceAudioService.getInstance();

        audioService?.setSourcePosition(sourcePosition);
      }
    );
  }, [sourcePosition]);

  useEffect(() => {
    import('~/services/audio/resonance-audio').then(
      ({ ResonanceAudioService }) => {
        const audioService = ResonanceAudioService.getInstance();

        audioService?.setOutputGain(gain / 100);
      }
    );
  }, [gain]);

  return { audioRef };
};
