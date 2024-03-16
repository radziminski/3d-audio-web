import { useJsAmbisonicsHoaAudioService } from '~/services/audio/hooks/use-js-ambisonics-hoa-audio-service/useJsAmbisonicsHoaAudioService';
import { CommonEvalContent } from '../CommonEvalContent';

export const JsAmbisonicsEval = () => {
  useJsAmbisonicsHoaAudioService();

  return (
    <>
      <CommonEvalContent />
    </>
  );
};
