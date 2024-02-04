import { useEffect } from 'react';
import { Layout } from '~/components/layout/Layout';
import { Mach } from '~/components/mach';
import { Providers } from '~/components/providers/Providers';
import { initMach } from '~/services/audio/mach/Mach';

const MachPage = () => {
  return (
    <Providers>
      <Layout>
        <Mach />
      </Layout>
    </Providers>
  );
};

export default MachPage;
