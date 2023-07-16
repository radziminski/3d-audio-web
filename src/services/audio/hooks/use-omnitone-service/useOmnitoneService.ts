import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useOmnitoneService = () => {
  const { gain, sourcePosition } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      if (!OmnitoneService.checkIsInitialized()) {
        router.push('/library');
      }
    });
  }, [router]);

  useLayoutEffect(() => {
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      if (audioRef.current && OmnitoneService.checkIsInitialized()) {
        const audioService = OmnitoneService.getInstance();

        if (audioService?.isAudioElementLinked()) {
          return;
        }

        audioService?.linkAudioElement(audioRef.current);
      }
    });
  }, []);

  useEffect(() => {
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      const audioService = OmnitoneService.getInstance();

      audioService?.setSourcePosition(sourcePosition);
    });
  }, [sourcePosition]);

  useEffect(() => {
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      const audioService = OmnitoneService.getInstance();

      audioService?.setOutputGain(gain / 100);
    });
  }, [gain]);

  return { audioRef };
};
