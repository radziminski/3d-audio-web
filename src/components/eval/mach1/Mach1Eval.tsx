import { useEffect, useLayoutEffect } from 'react';
import { useMach1AudioService } from '~/services/audio/hooks/use-mach1-audio-service/useMach1AudioService';
import { Mach1AudioService } from '~/services/audio/mach';
import { CommonEvalContent } from '../CommonEvalContent';

export const Mach1Eval = () => {
  const { audioRef } = useMach1AudioService();

  useEffect(() => {
    (window as any).azimuth = 0;

    const timeout = setInterval(() => {
      const audioService = Mach1AudioService.getInstance();

      const incrementedAzimuth = (window as any).azimuth + 5;
      (window as any).azimuth =
        incrementedAzimuth > 360 ? 0 : incrementedAzimuth;

      audioService?.setDirection({
        azimuth: (window as any).azimuth,
        elevation: 0,
      });
    }, 100);

    return () => clearInterval(timeout);
  }, []);

  useLayoutEffect(() => {
    audioRef.current?.play();
  }, [audioRef]);

  return (
    <>
      <CommonEvalContent />
    </>
  );
};
