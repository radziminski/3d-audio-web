import { Button, Modal, createStyles } from '@mantine/core';
import { Slider } from '~/components/slider/Slider';
import { CircularSlider } from '~/components/circular-slider/CircularSlider';
import { PropsWithChildren } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import {
  DEFAULT_ELEVATION,
  MAX_ELEVATION,
  MIN_ELEVATION,
} from '~/services/audio/constants';
import { useDisclosure } from '@mantine/hooks';
import { roundToDecimal } from '~/helpers/3D/getUnitSphereCoordinates';

const useStyles = createStyles((theme) => ({
  dialog: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    maxWidth: 650,
    maxHeight: 340,
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
    flexWrap: 'wrap',
  },
  sceneType: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    left: '48px',
    bottom: '48px',
    backdropFilter: 'blur(30px)',
    gap: '16px',
  },
  sceneTypeButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
}));

type SettingsProps = {
  isInsideView?: boolean;
} & PropsWithChildren;

export const Settings = ({ children, isInsideView = false }: SettingsProps) => {
  const { classes } = useStyles();
  const { azimuth, elevation } = useSettingsStore(({ azimuth, elevation }) => ({
    azimuth,
    elevation,
  }));
  const setAudioSrc = useSettingsStore(({ setAudioSource }) => setAudioSource);
  const onAzimuthChange = useSettingsStore(({ setAzimuth }) => setAzimuth);
  const setRandomAngles = useSettingsStore(
    ({ setRandomAngles }) => setRandomAngles
  );
  const setSceneType = useSettingsStore(({ setSceneType }) => setSceneType);
  const onElevationChange = useSettingsStore(
    ({ setElevation }) => setElevation
  );
  const onGainChange = useSettingsStore(({ setGain }) => setGain);

  const [opened, { open, close }] = useDisclosure(false);

  const windowAzimuth =
    typeof window !== 'undefined' ? (window as any)?.azimuth ?? 0 : 0;

  const windowElevation =
    typeof window !== 'undefined' ? (window as any)?.elevation ?? 0 : 0;

  return (
    <>
      <div className={isInsideView ? classes.dialogNarrow : classes.dialog}>
        <div className={classes.settings}>
          {!isInsideView && (
            <div className={classes.settingsColumn}>
              <div>
                <CircularSlider onChange={(value) => onAzimuthChange(value)} />
              </div>
            </div>
          )}
          <div
            className={
              isInsideView ? classes.settingsColumnFull : classes.settingsColumn
            }
          >
            <div className={classes.buttons}>
              <Button onClick={() => setAudioSrc('/sine.ogg')} size='xs'>
                Sine
              </Button>
              <Button onClick={() => setAudioSrc('/guitar.mp3')} size='xs'>
                Guitar
              </Button>
              <Button
                onClick={() => setAudioSrc('/female-voice.mp3')}
                size='xs'
              >
                Female speech
              </Button>
              <Button onClick={() => setAudioSrc('/test.mp3')} size='xs'>
                Song
              </Button>
              <Button onClick={() => setAudioSrc('/male-voice.mp3')} size='xs'>
                Male speech
              </Button>
            </div>
            {children}
            {!isInsideView && (
              <Slider
                min={MIN_ELEVATION}
                max={MAX_ELEVATION}
                defaultValue={DEFAULT_ELEVATION}
                onChange={onElevationChange}
                label='Elevation'
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
      <div className={classes.sceneType}>
        <div className={classes.sceneTypeButtons}>
          <Button onClick={() => setSceneType('outside')}>Outside view</Button>
          <Button onClick={() => setSceneType('inside')}>Inside view</Button>
        </div>
        {isInsideView && (
          <div className={classes.sceneTypeButtons}>
            <Button onClick={() => setRandomAngles()}>Randomize</Button>
            <Button onClick={() => open()}>Make a guess</Button>
          </div>
        )}
      </div>
      <Modal opened={opened} onClose={close} title='Your Guess'>
        True azimuth: {roundToDecimal(azimuth)}
        <br />
        True elevation: {roundToDecimal(elevation)}
        <br />
        <br />
        Your azimuth guess: {roundToDecimal(windowAzimuth)} (you were off by{' '}
        {roundToDecimal(Math.abs(azimuth - windowAzimuth))} degrees)
        <br />
        Your elevation guess: {roundToDecimal(windowElevation)} (you were off by{' '}
        {roundToDecimal(Math.abs(elevation - windowElevation))} degrees)
        <br />
      </Modal>
    </>
  );
};
