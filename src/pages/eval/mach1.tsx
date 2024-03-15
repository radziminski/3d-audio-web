import { useEffect, useState } from 'react';
import { Mach1Eval } from '~/components/eval/mach1/Mach1Eval';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';

const Mach1 = () => {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    import('~/services/audio/mach').then(({ Mach1AudioService }) => {
      (window as any).as = Mach1AudioService.getInstance(true);
    });

    setIsInit(true);
  }, []);

  if (!isInit) return null;

  return (
    <Providers>
      <Layout>
        <Mach1Eval />
      </Layout>
    </Providers>
  );
};

export default Mach1;
