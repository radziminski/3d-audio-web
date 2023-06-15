import { Center, createStyles } from '@mantine/core';
import { Poppins } from 'next/font/google';
import React from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Providers } from '../providers/Providers';
import { Scene } from '../three/scene/Scene';
import { Settings } from '../settings/Settings';
import { SceneInside } from '../three/scene-inside/SceneInside';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '800'],
  subsets: ['latin'],
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'linear-gradient(to bottom right, #49BCF6 , #49DEB2)',
    width: '100%',
    height: '100vh',
    fontFamily: 'var(--font-poppins)',
  },
  title: {
    position: 'fixed',
    top: '24px',
    left: '24px',
    fontFamily: 'var(--font-poppins)',
    color: 'white',
    fontWeight: 600,
    fontSize: 24,
    letterSpacing: '-0.4px',
  },
}));

type Props = {
  audioRef: React.RefObject<HTMLAudioElement>;
  title?: string;
};

export const AudioScene = ({ audioRef, title }: Props) => {
  const audioSource = useSettingsStore((state) => state.audioSource);
  const sceneType = useSettingsStore((state) => state.sceneType);
  const { classes } = useStyles();

  return (
    <Providers>
      <main className={poppins.className}>
        <div className={classes.title}>{title}</div>
        <Center className={classes.wrapper}>
          {sceneType === 'outside' && <Scene />}
          {sceneType === 'inside' && <SceneInside />}
        </Center>
        <Settings isInsideView={sceneType === 'inside'}>
          <audio controls src={audioSource} ref={audioRef} />
        </Settings>
      </main>
    </Providers>
  );
};
