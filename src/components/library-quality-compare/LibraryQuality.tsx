import { Center, createStyles } from '@mantine/core';
import { useEffect } from 'react';
import { LibraryQualityContent } from './LibraryQualityContent';

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'linear-gradient(to bottom right, #49BCF6 , #49DEB2)',
    width: '100%',
    minHeight: '100vh',
    fontFamily: 'var(--font-poppins)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '64px 32px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    maxWidth: 1200,
    width: '100%',
    gap: '16px',
  },
}));

export function LibraryQualityCompare() {
  const { classes } = useStyles();

  useEffect(() => {
    import('~/services/audio/resonance-audio').then(
      ({ ResonanceAudioService }) => {
        (window as any).as = ResonanceAudioService.getInstance(true);
      }
    );
    import('~/services/audio/web-audio-api').then(({ WebAudioApiService }) => {
      (window as any).as = WebAudioApiService.getInstance(true);
    });
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      (window as any).as = OmnitoneService.getInstance(true);
    });
    import('~/services/audio/js-ambisonics').then(
      ({ JsAmbisonicsAudioService }) => {
        (window as any).as = JsAmbisonicsAudioService.getInstance(true);
      }
    );
  }, []);

  return (
    <Center className={classes.wrapper}>
      <div className={classes.content}>
        <LibraryQualityContent />
      </div>
    </Center>
  );
}
