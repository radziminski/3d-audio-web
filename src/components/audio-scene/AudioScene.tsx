import { Center, createStyles } from '@mantine/core';
import { Poppins } from 'next/font/google';
import React, { Suspense } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Providers } from '../providers/Providers';
import { Settings } from '../settings/Settings';
import { TestModeInfo } from '../test-mode-info/TestModeInfo';
import dynamic from 'next/dynamic';
import { Layout } from '../layout/Layout';

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
}));

type Props = {
  audioRef: React.RefObject<HTMLAudioElement>;
  title?: string;
};

export const AudioScene = ({ audioRef, title }: Props) => {
  const sceneType = useSettingsStore((state) => state.sceneType);
  const { classes } = useStyles();

  const appMode = useSettingsStore((state) => state.appMode);

  return (
    <Providers>
      <div className={poppins.className}>
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
          />
          {appMode === 'test' && <TestModeInfo />}
        </Layout>
      </div>
    </Providers>
  );
};
