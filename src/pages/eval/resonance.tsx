import { ReactNode, useEffect, useState } from 'react';
import { ResonanceEval } from '~/components/eval/resonance/ResonanceEval';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';

const ResonanceContent = ({ children }: { children: ReactNode }) => {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    import('~/services/audio/resonance-audio').then(
      ({ ResonanceAudioService }) => {
        (window as any).as = ResonanceAudioService.getInstance(true);
      }
    );

    setIsInit(true);
  }, []);

  if (!isInit) return null;

  return <>{children}</>;
};

const Resonance = () => {
  return (
    <Providers>
      <Layout>
        <ResonanceContent>
          <ResonanceEval />
        </ResonanceContent>
      </Layout>
    </Providers>
  );
};

export default Resonance;
