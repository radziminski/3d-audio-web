import { Button } from '@mantine/core';
import { useEffect, useLayoutEffect } from 'react';
import { useJsAmbisonicsHoaAudioService } from '~/services/audio/hooks/use-js-ambisonics-hoa-audio-service/useJsAmbisonicsHoaAudioService';
import { CommonEvalContent } from '../CommonEvalContent';

export const JsAmbisonicsEval = () => {
  const { audioRef } = useJsAmbisonicsHoaAudioService();

  useEffect(() => {
    (window as any).azimuth = 0;

    const timeout = setInterval(() => {
      import('~/services/audio/js-ambisonics-hoa').then(
        ({ JsAmbisonicsHoaAudioService }) => {
          const audioService = JsAmbisonicsHoaAudioService.getInstance();

          const incrementedAzimuth = (window as any).azimuth + 5;
          (window as any).azimuth =
            incrementedAzimuth > 360 ? 0 : incrementedAzimuth;

          audioService?.setDirection({
            azimuth: -(window as any).azimuth,
            elevation: 0,
          });
        }
      );
    }, 100);

    return () => clearInterval(timeout);
  }, []);

  useLayoutEffect(() => {
    audioRef.current?.play();
  }, [audioRef]);

  return (
    <>
      <CommonEvalContent />
      <audio src='/guitar.mp3' ref={audioRef} loop />
    </>
  );
};
