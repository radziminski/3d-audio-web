import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { ResonanceAudioService } from '../../resonance-audio';

export const useResonanceAudioService = () => {
  const { gain, sourcePosition } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ResonanceAudioService.checkIsInitialized()) {
      router.push('/');
    }
  }, [router]);

  useLayoutEffect(() => {
    if (audioRef.current && ResonanceAudioService.checkIsInitialized()) {
      const audioService = ResonanceAudioService.getInstance();

      if (audioService?.isAudioElementLinked()) {
        return;
      }

      audioService?.linkAudioElement(audioRef.current);
    }
  }, []);

  useEffect(() => {
    const audioService = ResonanceAudioService.getInstance();

    audioService?.setSourcePosition(sourcePosition);
  }, [sourcePosition]);

  useEffect(() => {
    const audioService = ResonanceAudioService.getInstance();

    audioService?.setOutputGain(gain / 100);
  }, [gain]);

  return { audioRef };
};
