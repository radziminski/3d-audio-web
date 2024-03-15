import { useEffect, useState } from 'react';
import { JsAmbisonicsEval } from '~/components/eval/js-ambisonics/JsAmbisonicsEval';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';

const JsAmbisonics = () => {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    import('~/services/audio/js-ambisonics-hoa').then(
      ({ JsAmbisonicsHoaAudioService }) => {
        (window as any).as = JsAmbisonicsHoaAudioService.getInstance(true);
      }
    );

    setIsInit(true);
  }, []);

  if (!isInit) return null;

  return (
    <Providers>
      <Layout>
        <JsAmbisonicsEval />
      </Layout>
    </Providers>
  );
};

export default JsAmbisonics;
