import { useEffect, useLayoutEffect } from 'react';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';
import { useWebAudioApiService } from '~/services/audio/hooks/use-web-audio-api-service/useWebAudioApiService';
import { WebAudioApiService } from '~/services/audio/web-audio-api';

export const WebAudioEval = () => {
  const { audioRef } = useWebAudioApiService(true);

  useEffect(() => {
    (window as any).azimuth = 0;

    const timeout = setInterval(() => {
      const audioService = WebAudioApiService.getInstance();

      const incrementedAzimuth = (window as any).azimuth + 5;
      (window as any).azimuth =
        incrementedAzimuth > 360 ? 0 : incrementedAzimuth;

      const sourcePosition = getUniSphereCoordinates(
        (window as any).azimuth,
        0
      );

      audioService?.setSourcePosition(sourcePosition);
    }, 100);

    return () => clearInterval(timeout);
  }, []);

  useLayoutEffect(() => {
    audioRef.current?.play();
  }, [audioRef]);

  return (
    <>
      <h1>Evaluation in progress</h1>
      <audio src='/guitar.mp3' ref={audioRef} loop />
    </>
  );
};
