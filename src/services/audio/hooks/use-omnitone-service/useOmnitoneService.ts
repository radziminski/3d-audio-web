import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

type UseOmnitoneServiceOptions = {
  ref?: React.RefObject<HTMLAudioElement>;
  blockRedirects?: boolean;
  gainOverride?: number;
};

export const useOmnitoneService = ({
  ref,
  blockRedirects,
  gainOverride,
}: UseOmnitoneServiceOptions = {}) => {
  const { gain, sourcePosition } = useSettingsStore();
  const router = useRouter();

  const audioRefNew = useRef<HTMLAudioElement>(null);
  const audioRef = ref ?? audioRefNew;

  useEffect(() => {
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      if (!OmnitoneService.checkIsInitialized() && !blockRedirects) {
        router.push('/library-redirect?library=omnitone');
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

      audioService?.setOutputGain((gainOverride ?? gain) / 100);
    });
  }, [gain, gainOverride]);

  return { audioRef };
};
