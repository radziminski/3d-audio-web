import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { WebAudioApiService } from '~/services/audio/web-audio-api';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useWebAudioApiService = () => {
  const { gain, sourcePosition } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!WebAudioApiService.checkIsInitialized()) {
      router.push('/');
    }
  }, [router]);

  useLayoutEffect(() => {
    if (audioRef.current && WebAudioApiService.checkIsInitialized()) {
      const audioService = WebAudioApiService.getInstance();

      if (audioService?.isAudioElementLinked()) {
        return;
      }

      audioService?.linkAudioElement(audioRef.current);
    }
  }, []);

  useEffect(() => {
    const audioService = WebAudioApiService.getInstance();

    audioService?.setSourcePosition(sourcePosition);
  }, [sourcePosition]);

  useEffect(() => {
    const audioService = WebAudioApiService.getInstance();

    audioService?.setOutputGain(gain / 100);
  }, [gain]);

  return { audioRef };
};
