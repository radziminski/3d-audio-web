import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { SOURCES_COUNT } from '~/components/eval/eval.constants';
import { WebAudioApiService } from '~/services/audio/web-audio-api';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useWebAudioApiService = (enable?: boolean) => {
  const { gain, sourcePosition } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect(() => {
  //   if (!WebAudioApiService.checkIsInitialized()) {
  //     router.push('/library-redirect?library=web-api');
  //   }
  // }, [router]);

  useLayoutEffect(() => {
    if (enable && WebAudioApiService.checkIsInitialized()) {
      const audioService = WebAudioApiService.getInstance();

      audioService
        ?.createAndConnectSources(SOURCES_COUNT, '/guitar.mp3')
        .then(() => {
          audioService?.playAllSources();
        });
    }
  });

  // useLayoutEffect(() => {
  //   if (enable && audioRef.current && WebAudioApiService.checkIsInitialized()) {
  //     const audioService = WebAudioApiService.getInstance();

  //     if (audioService?.isAudioElementLinked()) {
  //       return;
  //     }

  //     audioService?.linkAudioElement(audioRef.current);
  //   }
  // }, [enable]);

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
