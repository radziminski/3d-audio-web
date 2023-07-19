import Head from 'next/head';
import { Poppins } from 'next/font/google';
import { Button, Center, createStyles } from '@mantine/core';
import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useRedirectToLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useTestStore } from '~/store/settings/useTestStore';
import { useTestMode } from '~/hooks/use-test-mode/useTestMode';
import { TestModeInfo } from '~/components/test-mode-info/TestModeInfo';

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
  back: {
    position: 'fixed',
    top: '24px',
    left: '24px',
    fontFamily: 'var(--font-poppins)',
    color: 'white',
    zIndex: 999,
    fontWeight: 500,
    fontSize: 16,
    display: 'block',
    textDecoration: 'underline',
    cursor: 'pointer',
    textUnderlineOffset: '3px',
    transition: 'opacity 150ms ease-in-out',
    opacity: 0.7,
    '&:hover': {
      opacity: 1,
    },
  },
}));

export default function LibraryPage() {
  const { classes } = useStyles();

  return (
    <Providers>
      <Center className={classes.wrapper}>TEST RESULT</Center>
    </Providers>
  );
}
