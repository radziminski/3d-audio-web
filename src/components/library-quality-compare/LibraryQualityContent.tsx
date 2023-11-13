import { useRef } from 'react';
import { useOmnitoneService } from '~/services/audio/hooks/use-omnitone-service/useOmnitoneService';

export const LibraryQualityContent = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useOmnitoneService({
    ref: audioRef,
    blockRedirects: true,
    gainOverride: 30,
  });

  return (
    <>
      <h1>Audio</h1>
      <audio controls src={'/guitar.mp3'} ref={audioRef} loop />
    </>
  );
};
