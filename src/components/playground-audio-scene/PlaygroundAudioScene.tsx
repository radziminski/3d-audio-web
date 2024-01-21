import React, { useEffect } from 'react';
import { AudioScene } from '../audio-scene/AudioScene';
import { useCompareAudioService } from '~/services/audio/hooks/use-compare-audio-service/useCompareAudioService';
import { useTestStore } from '~/store/settings/useTestStore';
import { useRouter } from 'next/router';
import { Select, createStyles } from '@mantine/core';
import { SUPPORTED_LIBRARIES } from '~/hooks/use-test-mode/useTestMode';
import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

const useStyles = createStyles(() => ({
  librarySelect: {
    position: 'fixed',
    top: '64px',
    right: '64px',
    zIndex: 1000,
    color: 'white',
    '@media (max-width: 700px)': {
      top: '32px',
      right: '16px',
    },
  },
}));

export const PlaygroundAudioScene = () => {
  const { classes } = useStyles();
  const currentLibrary = useTestStore((state) => state.currentLibrary);
  const setCurrentLibrary = useTestStore((state) => state.setCurrentLibrary);

  const {
    query: { library },
  } = useRouter();

  useEffect(() => {
    if (SUPPORTED_LIBRARIES.includes(library as SupportedLibrary)) {
      setCurrentLibrary(library as SupportedLibrary);
    }
  }, [library, setCurrentLibrary]);

  const { audioRef } = useCompareAudioService(currentLibrary, currentLibrary);

  const setAppMode = useSettingsStore((state) => state.setAppMode);

  useEffect(() => {
    setAppMode('playground');
  }, [setAppMode]);

  return (
    <>
      <div className={classes.librarySelect}>
        <Select
          label='Pick library'
          placeholder='Choose audio sample'
          onChange={(value) => {
            setCurrentLibrary(value as SupportedLibrary);
          }}
          value={currentLibrary}
          data={SUPPORTED_LIBRARIES.map((lib) => ({
            label: lib,
            value: lib,
          }))}
        />
      </div>
      <AudioScene audioRef={audioRef} title='Playground' />
    </>
  );
};
