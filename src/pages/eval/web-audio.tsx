import { useEffect, useState } from 'react';
import { WebAudioEval } from '~/components/eval/web-audio/WebAudioEval';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';

const WebAudio = () => {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    import('~/services/audio/web-audio-api').then(({ WebAudioApiService }) => {
      (window as any).as = WebAudioApiService.getInstance(true);
    });

    setIsInit(true);
  }, []);

  if (!isInit) return null;

  return (
    <Providers>
      <Layout>
        <WebAudioEval />
      </Layout>
    </Providers>
  );
};

export default WebAudio;
