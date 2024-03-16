import { useResonanceAudioService } from '~/services/audio/hooks/use-resonance-audio-service/useResonanceAudioService';
import { CommonEvalContent } from '../CommonEvalContent';

export const ResonanceEval = () => {
  useResonanceAudioService();

  return (
    <>
      <CommonEvalContent />
    </>
  );
};
