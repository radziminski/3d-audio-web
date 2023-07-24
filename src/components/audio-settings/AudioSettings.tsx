import { createStyles } from '@mantine/core';
import { Slider } from '~/components/slider/Slider';
import { CircularSlider } from '~/components/circular-slider/CircularSlider';
import { RefObject, useCallback } from 'react';
import { AppMode, useSettingsStore } from '~/store/settings/useSettingsStore';
import {
  DEFAULT_ELEVATION,
  MAX_ELEVATION,
  MIN_ELEVATION,
} from '~/services/audio/constants';
import { AudioSourceSelect } from '../audio-source-select/AudioSourceSelect';
import { useTestStore } from '~/store/settings/useTestStore';

const useStyles = createStyles((theme) => ({
  dialog: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    maxWidth: 650,
    maxHeight: 300,
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
  dialogNarrow: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    maxWidth: 380,
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
    gap: '8px',
  },
  settingsColumnFull: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    gap: '16px',
  },
  select: {
    marginBottom: '16px',
  },
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
    flexWrap: 'wrap',
  },
}));

type AudioSettingsProps = {
  isInsideView?: boolean;
  audioRef?: RefObject<HTMLAudioElement>;
};

export const AudioSettings = ({
  isInsideView = false,
  audioRef,
}: AudioSettingsProps) => {
  const mode = useSettingsStore((state) => state.appMode);
  const isGuessingMode = mode === 'guess' || mode === 'test';

  const { classes } = useStyles();
  const onAzimuthChange = useSettingsStore(({ setAzimuth }) => setAzimuth);
  const audioSource = useSettingsStore((state) => state.audioSource);
  const elevation = useSettingsStore((state) => state.elevation);
  const azimuth = useSettingsStore((state) => state.azimuth);

  const onElevationChange = useSettingsStore(
    ({ setElevation }) => setElevation
  );
  const onGainChange = useSettingsStore(({ setGain }) => setGain);

  const setGuessedAzimuth = useTestStore((state) => state.setGuessedAzimuth);
  const setGuessedElevation = useTestStore(
    (state) => state.setGuessedElevation
  );

  const guessedAzimuth = useTestStore((state) => state.azimuthGuess);
  const guessedElevation = useTestStore((state) => state.elevationGuess);

  return (
    <div className={isInsideView ? classes.dialogNarrow : classes.dialog}>
      <div className={classes.settings}>
        {!isInsideView && (
          <div className={classes.settingsColumn}>
            <div>
              <CircularSlider
                onChange={(value) => {
                  const prevValue = isGuessingMode ? guessedAzimuth : azimuth;
                  const newValue = value === 1 ? prevValue : value;

                  if (isGuessingMode) {
                    setGuessedAzimuth(newValue);
                    return;
                  }

                  onAzimuthChange(360 - newValue);
                }}
              />
            </div>
          </div>
        )}
        <div
          className={
            isInsideView ? classes.settingsColumnFull : classes.settingsColumn
          }
        >
          <div className={classes.select}>
            <AudioSourceSelect />
          </div>
          <audio controls src={audioSource} ref={audioRef} loop />
          {!isInsideView && (
            <Slider
              min={MIN_ELEVATION}
              max={MAX_ELEVATION}
              defaultValue={DEFAULT_ELEVATION}
              onChange={
                isGuessingMode ? setGuessedElevation : onElevationChange
              }
              label='Elevation'
              value={isGuessingMode ? guessedElevation : elevation}
            />
          )}
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
