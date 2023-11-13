import { Button } from '@mantine/core';
import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Layout } from '~/components/layout/Layout';

export default function Home() {
  const router = useRouter();

  const setMode = useSettingsStore((state) => state.setAppMode);
  const resetStore = useSettingsStore((state) => state.reset);

  useEffect(() => {
    resetStore();
  }, [resetStore]);

  const onGoToLibraryChoice = useCallback(() => {
    router.push('/library');
  }, [router]);

  const onGoToPlayground = useCallback(() => {
    setMode('playground');
    onGoToLibraryChoice();
  }, [setMode, onGoToLibraryChoice]);

  const onGoToGuessing = useCallback(() => {
    setMode('guess');
    onGoToLibraryChoice();
  }, [setMode, onGoToLibraryChoice]);

  const onGoToTest = useCallback(() => {
    setMode('test');
    router.push('/test');
  }, [setMode, router]);

  return (
    <Providers>
      <Layout>
        <Button onClick={onGoToPlayground}>Playground</Button>
        <Button onClick={onGoToGuessing}>Guessing</Button>
        <Button onClick={onGoToTest}>Test</Button>
      </Layout>
    </Providers>
  );
}
