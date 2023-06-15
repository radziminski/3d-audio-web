import { Button, createStyles } from '@mantine/core';
import { Slider } from '~/components/slider/Slider';
import { CircularSlider } from '~/components/circular-slider/CircularSlider';
import { PropsWithChildren } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import {
  DEFAULT_ELEVATION,
  MAX_ELEVATION,
  MIN_ELEVATION,
} from '~/services/audio/constants';

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

export const Settings = ({ children }: PropsWithChildren) => {
  const { classes } = useStyles();
  const setAudioSrc = useSettingsStore(({ setAudioSource }) => setAudioSource);
  const onAzimuthChange = useSettingsStore(({ setAzimuth }) => setAzimuth);
  const onElevationChange = useSettingsStore(
    ({ setElevation }) => setElevation
  );
  const onGainChange = useSettingsStore(({ setGain }) => setGain);

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
          {children}
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
