import { useWebAudioApiService } from '~/services/audio/hooks/use-web-audio-api-service/useWebAudioApiService';
import { CommonEvalContent } from '../CommonEvalContent';

export const WebAudioEval = () => {
  useWebAudioApiService(true);

  return (
    <>
      <CommonEvalContent />
    </>
  );
};
