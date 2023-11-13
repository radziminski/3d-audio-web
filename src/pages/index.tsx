import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Layout } from '~/components/layout/Layout';
import { Button } from '@mantine/core';

export default function Home() {
  const router = useRouter();
  const resetStore = useSettingsStore((state) => state.reset);

  useEffect(() => {
    resetStore();
  }, [resetStore]);

  return (
    <Providers>
      <Layout>
        <h1>Hello 👋🏻</h1>
        <Button onClick={() => router.push('/preparation')}>Start</Button>
      </Layout>
    </Providers>
  );
}
