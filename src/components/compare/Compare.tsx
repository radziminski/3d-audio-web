import { useEffect, useState } from 'react';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useCompareAudioService } from '~/services/audio/hooks/use-compare-audio-service/useCompareAudioService';
import { AudioSettings } from '../audio-settings/AudioSettings';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Button, createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '64px',
  },
  buttons: {
    display: 'flex',
    gap: '24px',
  },
}));

export const Compare = () => {
  const [isReady, setIsReady] = useState(false);

  const { classes } = useStyles();
  const setAzimuth = useSettingsStore((state) => state.setAzimuth);
  const setElevation = useSettingsStore((state) => state.setElevation);
  const setAppMode = useSettingsStore((state) => state.setAppMode);

  const [selectedLibrary, setSelectedLibrary] = useState<
    SupportedLibrary | 'js-ambisonics-hoa'
  >();
  const { audioRef } = useCompareAudioService(selectedLibrary);

  useEffect(() => {
    setAppMode('playground');
    setElevation(0);
    setAzimuth(0);
    setIsReady(true);
  }, [setAppMode, setAzimuth, setElevation]);

  if (!isReady) {
    return null;
  }

  return (
    <div className={classes.container}>
      <AudioSettings audioRef={audioRef} disableFixedPosition />

      <div className={classes.buttons}>
        {(
          [
            undefined,
            'web-api',
            'js-ambisonics',
            'js-ambisonics-hoa',
            'resonance',
            'omnitone',
          ] as const
        ).map((library) => (
          <Button
            key={library}
            onClick={() => setSelectedLibrary(library)}
            color={selectedLibrary === library ? 'red' : undefined}
          >
            {library ?? 'Bypass'}
          </Button>
        ))}
      </div>
    </div>
  );
};
