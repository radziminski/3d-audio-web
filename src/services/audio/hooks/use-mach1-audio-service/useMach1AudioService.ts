import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Mach1AudioService } from '../../mach';

export const useMach1AudioService = () => {
  const { gain, azimuth, elevation } = useSettingsStore();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioService = Mach1AudioService.getInstance();

    audioService?.setSourceForMach('/guitar.mp3', () => {
      setTimeout(() => {
        audioService.machPlay();
      }, 50);
    });
  }, []);

  useEffect(() => {
    const audioService = Mach1AudioService.getInstance();

    audioService?.setOutputGain(gain / 100);
  }, [gain]);

  return { audioRef };
};
