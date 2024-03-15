import { useEffect, useLayoutEffect } from 'react';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';
import { useResonanceAudioService } from '~/services/audio/hooks/use-resonance-audio-service/useResonanceAudioService';

export const ResonanceEval = () => {
  const { audioRef } = useResonanceAudioService();

  useEffect(() => {
    (window as any).azimuth = 0;

    const timeout = setInterval(() => {
      import('~/services/audio/resonance-audio').then(
        ({ ResonanceAudioService }) => {
          const audioService = ResonanceAudioService.getInstance();

          const incrementedAzimuth = (window as any).azimuth + 5;
          (window as any).azimuth =
            incrementedAzimuth > 360 ? 0 : incrementedAzimuth;

          const sourcePosition = getUniSphereCoordinates(
            (window as any).azimuth,
            0
          );

          audioService?.setSourcePosition(sourcePosition);
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
      <h1>Evaluation in progress</h1>
      <audio src='/guitar.mp3' ref={audioRef} loop />
    </>
  );
};
