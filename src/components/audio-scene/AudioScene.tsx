import { Button, createStyles } from '@mantine/core';
import { Poppins } from 'next/font/google';
import React, { Suspense, useEffect, useRef } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Providers } from '../providers/Providers';
import { Settings } from '../settings/Settings';
import { TestModeInfo } from '../test-mode-info/TestModeInfo';
import dynamic from 'next/dynamic';
import { Layout } from '../layout/Layout';
import { AudioSource } from '../audio-source-select/AudioSourceSelect';
import { useDebouncedState } from '@mantine/hooks';
import { useTestStore } from '~/store/settings/useTestStore';

const SceneInside = dynamic(
  () =>
    import('../three/scene-inside/SceneInside').then(
      (module) => module.SceneInside
    ),
  {
    ssr: false,
  }
);
const Scene = dynamic(
  () => import('../three/scene/Scene').then((module) => module.Scene),
  {
    ssr: false,
  }
);
const SceneAlt = dynamic(
  () => import('../three/scene-alt/SceneAlt').then((module) => module.Stage),
  {
    ssr: false,
  }
);

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '800'],
  subsets: ['latin'],
});

const useStyles = createStyles((theme) => ({
  title: {
    position: 'fixed',
    top: '24px',
    left: '24px',
    fontFamily: 'var(--font-poppins)',
    color: 'white',
    fontWeight: 600,
    fontSize: 28,
    letterSpacing: '-0.4px',
    zIndex: 999,
  },
  link: {
    fontFamily: 'var(--font-poppins)',
    color: 'white',
    fontWeight: 500,
    fontSize: 16,
    display: 'block',
    textUnderlineOffset: '3px',
    transition: 'opacity 150ms ease-in-out',
    opacity: 0.7,
    '&:hover': {
      opacity: 1,
    },
  },
  bypassButton: {
    position: 'fixed',
    right: '48px',
    bottom: '340px',
    height: '48px',
    '@media (max-width: 1500px)': {
      bottom: '330px',
    },
    '@media (max-width: 700px)': {
      bottom: '270px',
      right: '16px',
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '8px',
  },
  small: {
    paddingTop: '4px',
    fontSize: 12,
  },
}));

type Props = {
  audioRef: React.RefObject<HTMLAudioElement>;
  title?: string;
  machPlay?: () => void;
  machPause?: () => void;
  isMach?: boolean;
  audioSources?: AudioSource[];
};

export const AudioScene = ({
  audioRef,
  title,
  audioSources,
  ...machProps
}: Props) => {
  const sceneType = useSettingsStore((state) => state.sceneType);
  const { classes } = useStyles();

  const appMode = useSettingsStore((state) => state.appMode);
  const setStoreIsReference = useSettingsStore((state) => state.setIsReference);
  const storeIsReference = useSettingsStore((state) => state.isReference);

  // new
  const [isReference, setIsReference] = useDebouncedState<boolean | undefined>(
    undefined,
    100
  );

  useEffect(() => {
    setStoreIsReference(isReference ?? false);
  }, [isReference, setStoreIsReference]);

  const setAngles = useSettingsStore((state) => state.setAngles);

  const currentAngle = useTestStore((state) => state.currentAngle);

  useEffect(() => {
    if (storeIsReference) {
      setAngles(0, 0);

      return;
    }

    if (storeIsReference === false) {
      setAngles(currentAngle?.azimuth ?? 0, currentAngle?.elevation ?? 0);
    }
  }, [
    storeIsReference,
    setAngles,
    currentAngle?.azimuth,
    currentAngle?.elevation,
  ]);

  return (
    <Providers>
      <div className={poppins.className} style={{ width: '100%' }}>
        <div className={classes.title}>
          {appMode !== 'test' ? (
            <>
              {title}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href='/debug' className={classes.link}>
                &larr; Go back to debug
              </a>
            </>
          ) : null}
        </div>
        <Layout noPadding>
          <Suspense fallback={<h5>Loading...</h5>}>
            {sceneType === 'outside' && <Scene />}
            {sceneType === 'inside' && <SceneInside />}
            {sceneType === 'alt' && <SceneAlt />}
          </Suspense>
          <Settings
            isInsideView={sceneType === 'inside' || sceneType === 'alt'}
            audioRef={audioRef}
            audioSources={audioSources}
            {...machProps}
          />
          {appMode === 'test' && <TestModeInfo />}
          <Button
            className={classes.bypassButton}
            onMouseDown={() => {
              setIsReference(true);
            }}
            onMouseUp={() => {
              setIsReference(false);
            }}
          >
            <div className={classes.content}>
              <div>Hold for reference</div>
              <div className={classes.small}>
                azimuth: 0&deg;, elevation: 0&deg;
              </div>
            </div>
          </Button>
        </Layout>
      </div>
    </Providers>
  );
};
