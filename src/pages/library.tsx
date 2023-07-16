import Head from 'next/head';
import { Poppins } from 'next/font/google';
import { Button, Center, createStyles } from '@mantine/core';
import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useRedirectToLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';

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

const SUPPORTED_LIBRARIES = [
  {
    label: 'Web Audio Api',
    library: 'web-audio',
  },
  {
    label: 'Resonance Audio',
    library: 'resonance',
  },
  {
    label: 'Omnitone',
    library: 'omnitone',
  },
  {
    label: 'JS Ambisonics',
    library: 'js-ambisonics',
  },
] as const;

export default function LibraryPage() {
  const { classes } = useStyles();

  const { redirectToLibrary } = useRedirectToLibrary();

  return (
    <Providers>
      <Center className={classes.wrapper}>
        {SUPPORTED_LIBRARIES.map(({ label, library }) => (
          <Button key={library} onClick={() => redirectToLibrary(library)}>
            {label}
          </Button>
        ))}
      </Center>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className={classes.back} href='/'>
        &larr; Go back to mode choice
      </a>
    </Providers>
  );
}
