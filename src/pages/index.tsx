import Head from 'next/head';
import { Poppins } from 'next/font/google';
import { Button, Center, createStyles } from '@mantine/core';
import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useRedirectToLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'linear-gradient(to bottom right, #49BCF6 , #49DEB2)',
    width: '100%',
    height: '100vh',
    fontFamily: 'var(--font-poppins)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  dialog: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '18px',
    maxWidth: 700,
    maxHeight: '80%',
    width: '100%',
    height: '100%',
    padding: ' 64px 48px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function Home() {
  const { classes } = useStyles();
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
      <Center className={classes.wrapper}>
        <Button onClick={onGoToPlayground}>Playground</Button>
        <Button onClick={onGoToGuessing}>Guessing</Button>
        <Button onClick={onGoToTest}>Test</Button>
      </Center>
    </Providers>
  );
}
