import { Poppins } from 'next/font/google';
import { Button, createStyles } from '@mantine/core';
import { Slider } from '~/components/slider/Slider';
import { CircularSlider } from '~/components/circular-slider/CircularSlider';
import { useLayoutEffect, useRef, useState } from 'react';
import { AudioService } from '~/services/audio';
import { useAudioService } from '~/hooks/use-audio-service/useAudioService';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import {
  DEFAULT_ELEVATION,
  MAX_ELEVATION,
  MIN_ELEVATION,
} from '~/services/audio/constants';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '800'],
  subsets: ['latin'],
});

const useStyles = createStyles((theme) => ({
  dialog: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    maxWidth: 650,
    maxHeight: 310,
    width: '100%',
    height: '100%',
    padding: '64px 48px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    right: '48px',
    bottom: '48px',
    backdropFilter: 'blur(30px)',
  },
  settings: {
    display: 'flex',
    width: '100%',
    gap: '42px',
  },
  settingsColumn: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    gap: '16px',
  },
  slider: {},
  sliderTitle: {
    fontSize: '16px',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 400,
    color: 'white',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    justifyContent: 'space-between',
  },
}));

const audio =
  'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/330/guide-you-home-1676595644-ChvWHWcgo4.mp3';

export const Settings = () => {
  useAudioService();

  const audioRef = useRef<HTMLAudioElement>(null);
  const { classes } = useStyles();
  const [audioSrc, setAudioSrc] = useState('/test.mp3');
  const onAzimuthChange = useSettingsStore(({ setAzimuth }) => setAzimuth);
  const onElevationChange = useSettingsStore(
    ({ setElevation }) => setElevation
  );
  const onGainChange = useSettingsStore(({ setGain }) => setGain);

  const isAudioServiceInitialized = AudioService.checkIsInitialized();

  useLayoutEffect(() => {
    if (audioRef.current && AudioService.checkIsInitialized()) {
      const audioService = AudioService.getInstance();

      if (audioService?.isAudioElementLinked()) {
        return;
      }

      audioService?.linkAudioElement(audioRef.current);
    }
  }, []);

  if (!isAudioServiceInitialized) {
    return null;
  }

  return (
    <div className={classes.dialog}>
      <div className={classes.settings}>
        <div className={classes.settingsColumn}>
          <div>
            <CircularSlider onChange={(value) => onAzimuthChange(value)} />
          </div>
        </div>
        <div className={classes.settingsColumn}>
          <div className={classes.buttons}>
            <Button onClick={() => setAudioSrc('/sine.ogg')}>Sine</Button>
            <Button onClick={() => setAudioSrc('/guitar.mp3')}>Guitar</Button>
            <Button onClick={() => setAudioSrc('/test.mp3')}>Song</Button>
          </div>
          <audio controls src={audioSrc} ref={audioRef} />
          <Slider
            min={MIN_ELEVATION}
            max={MAX_ELEVATION}
            defaultValue={DEFAULT_ELEVATION}
            onChange={onElevationChange}
            label='Elevation'
          />
          <Slider
            onChange={onGainChange}
            label='Gain'
            min={0}
            max={100}
            defaultValue={100}
          />
        </div>
      </div>
    </div>
  );
};
