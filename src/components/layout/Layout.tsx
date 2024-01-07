import { PropsWithChildren, useEffect } from 'react';
import { Button, Center, createStyles } from '@mantine/core';
import {
  useContextStore,
  useSettingsStore,
  useTestId,
  useTestIdStore,
} from '../../store/settings/useSettingsStore';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';

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
  withPadding: {
    padding: '64px 32px',
  },
}));

type LayoutProps = {
  noPadding?: boolean;
  withScroll?: boolean;
} & PropsWithChildren;

export const Layout = ({ children, noPadding, withScroll }: LayoutProps) => {
  const isContextStarted = useContextStore((state) => state.isContextStarted);
  const setIsContextStarted = useContextStore(
    (state) => state.setIsContextStarted
  );
  const testId = useTestIdStore((state) => state.testId);
  const setTestId = useTestIdStore((state) => state.setTestId);

  const { classes } = useStyles();
  const { pathname } = useRouter();

  useEffect(() => {
    if (
      [
        '/',
        '/preparation/stereo-check',
        '/preparation/tutorial',
        '/debug',
        '/test',
        '/js-ambisonics-audio',
        '/omnitone-audio',
        '/resonance-audio',
        '/web-api-audio',
      ].includes(pathname)
    ) {
      setIsContextStarted(true);
    }
  }, [pathname, setIsContextStarted]);

  useEffect(() => {
    if (testId === null) {
      console.log('SETTING TEST ID');

      setTestId(nanoid());
    } else {
      console.log('TEST ID ALREADY SET:', testId);
    }
  }, [setTestId, testId]);

  return (
    <Center
      className={`${classes.wrapper} ${noPadding ? '' : classes.withPadding}`}
      style={
        withScroll
          ? {
              height: 'unset',
              minHeight: '100vh',
            }
          : undefined
      }
    >
      {!isContextStarted && (
        <Button onClick={() => setIsContextStarted(true)}>
          Initialize audio context
        </Button>
      )}
      {isContextStarted && children}
    </Center>
  );
};
