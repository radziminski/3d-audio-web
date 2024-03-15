import { Button, createStyles } from '@mantine/core';
import { Slider } from '~/components/slider/Slider';
import { CircularSlider } from '~/components/circular-slider/CircularSlider';
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import {
  DEFAULT_ELEVATION,
  MAX_ELEVATION,
  MIN_ELEVATION,
} from '~/services/audio/constants';
import {
  AudioSource,
  AudioSourceSelect,
} from '../audio-source-select/AudioSourceSelect';
import { useTestStore } from '~/store/settings/useTestStore';
import { ReferenceButton } from '../reference-button/ReferenceButton';
import { useMediaQuery } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  dialog: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    maxWidth: 650,
    maxHeight: 280,
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
    '@media (max-width: 1500px)': {
      maxWidth: 520,
      maxHeight: 270,
      padding: '32px',
    },
    '@media (max-width: 700px)': {
      right: 0,
      left: 0,
      bottom: 0,
      maxHeight: 260,
      maxWidth: '100%',
      padding: '16px',
    },
  },
  dialogNotFixed: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    maxWidth: 650,
    maxHeight: 280,
    width: '100%',
    height: '100%',
    padding: '64px 48px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(30px)',
    '@media (max-width: 1500px)': {
      maxWidth: 520,
      maxHeight: 270,
      padding: '32px',
    },
    '@media (max-width: 700px)': {
      maxHeight: 260,
      maxWidth: '95vw',
      overflow: 'hidden',
      padding: '16px',
    },
  },
  dialogNarrow: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    maxWidth: 380,
    maxHeight: 280,
    width: '100%',
    height: '100%',
    padding: '48px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    right: '48px',
    bottom: '48px',
    backdropFilter: 'blur(30px)',
    '@media (max-width: 1500px)': {
      maxHeight: 270,
      padding: '32px',
    },
    '@media (max-width: 700px)': {
      right: 0,
      left: 0,
      bottom: 0,
      maxHeight: 220,
      maxWidth: '100%',
      padding: '16px',
      paddingBottom: '50px',
    },
  },
  settings: {
    display: 'flex',
    width: '100%',
    gap: '80px',
    '@media (max-width: 700px)': {
      justifyContent: 'center',
      gap: '20px',
    },
  },
  settingsNotFixed: {
    display: 'flex',
    width: '100%',
    gap: '80px',
    '@media (max-width: 700px)': {
      justifyContent: 'center',
      gap: '60px',
    },
  },
  settingsColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    gap: '8px',
    flexGrow: 1,
    ':last-child': {
      paddingBottom: '32px',
      '@media (max-width: 1500px)': {
        width: '230px',
      },
      '@media (max-width: 700px)': {
        paddingBottom: 0,
      },
      '@media (max-width: 450px)': {
        width: '200px',
      },
    },
  },
  settingsColumnFull: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    gap: '16px',
    flexGrow: 1,
    '@media (max-width: 700px)': {
      gap: '0px',
      h2: {
        margin: 0,
      },
    },
  },
  select: {
    marginBottom: '16px',
    height: 60,
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
  slider: {
    width: 200,
    div: {
      opacity: '1 !important',
      div: {
        opacity: '1 !important',
      },
    },
    '@media (max-width: 1500px)': {
      width: 160,
    },
    '@media (max-width: 700px)': {
      width: 120,
    },
  },
  audio: {
    '@media (max-width: 1500px)': {
      maxWidth: 250,
    },
    '@media (max-width: 700px)': {
      position: 'fixed',
      bottom: '4px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '80vw',
    },
  },
  elevation: {
    position: 'absolute',
    left: '-50px',
    bottom: '-30px',
    color: 'white',
    fontWeight: 600,
    width: '140px',
    '@media (max-width: 700px)': {
      bottom: '-18px',
    },
  },
  elevationSlider: {
    position: 'absolute',
    left: '-50px',
    top: '0px',
    '@media (max-width: 1500px)': {
      left: '-35px',
    },
    '@media (max-width: 700px)': {
      left: '-100px',
    },
    '@media (max-width: 400px)': {
      left: '-80px',
    },
  },
  elevationInput: {
    height: '210px !important',
    writingMode: 'vertical-lr',
    '@media (max-width: 700px)': {
      height: '150px !important',
    },
    transform: 'translateX(-10px)',
  },
  button: {
    width: '100%',
  },
}));

type AudioSettingsProps = {
  isInsideView?: boolean;
  audioRef?: RefObject<HTMLAudioElement>;
  disableFixedPosition?: boolean;
  machPlay?: () => void;
  machPause?: () => void;
  isMach?: boolean;
  audioSources?: AudioSource[];
};

export const AudioSettings = ({
  isInsideView = false,
  audioRef,
  disableFixedPosition = false,
  machPause,
  machPlay,
  isMach,
  audioSources,
}: AudioSettingsProps) => {
  const isMobile = useMediaQuery('(max-width: 700px)', false);

  const mode = useSettingsStore((state) => state.appMode);
  const isGuessingMode = mode === 'guess' || mode === 'test';

  const { classes } = useStyles();
  const onAzimuthChange = useSettingsStore(({ setAzimuth }) => setAzimuth);
  const gain = useSettingsStore((state) => state.gain);
  const audioSource = useSettingsStore((state) => state.audioSource);
  const elevation = useSettingsStore((state) => state.elevation);
  const azimuth = useSettingsStore((state) => state.azimuth);
  const isMachLoading = useSettingsStore((state) => state.isMachLoading);
  const isPlaying = useSettingsStore((state) => state.isPlaying);

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
  const isGuessMade = useTestStore((state) => state.isGuessMade);
  const currentStep = useTestStore((state) => state.currentStep);
  const currentAngles = useTestStore((state) => state.currentAngle);

  const shouldHideAzimuth =
    currentAngles?.guessType === 'elevation' && isMobile;
  const shouldHideElevation =
    currentAngles?.guessType === 'azimuth' && isMobile;

  const guessType = useTestStore((state) => state.guessType);

  useLayoutEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        if (isMach) {
          if (isPlaying) {
            machPause?.();
            return;
          }

          machPlay?.();
          return;
        }

        if (audioRef?.current?.paused) {
          audioRef?.current?.play();
          return;
        }

        audioRef?.current?.pause();
      }
    };

    window.addEventListener('keydown', listener);

    return () => window.removeEventListener('keydown', listener);
  }, [audioRef, isInsideView]);

  const appMode = useSettingsStore(({ appMode }) => appMode);
  const setIsPlaying = useSettingsStore(({ setIsPlaying }) => setIsPlaying);
  const setLastSample = useTestStore(({ setLastSample }) => setLastSample);
  const addUsedSample = useTestStore(({ addUsedSample }) => addUsedSample);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);

    if (appMode === 'test') {
      setLastSample(audioSource);
      addUsedSample(audioSource);
    }
  }, [addUsedSample, appMode, audioSource, setLastSample, setIsPlaying]);

  const handlePause = useCallback(() => {
    if (!isMach) setIsPlaying(false);
  }, [setIsPlaying, isMach]);

  const handlePlayToggle = useCallback(() => {
    if (isMach) {
      if (isPlaying) {
        setIsPlaying(false);
        machPause?.();
        return;
      }

      handlePlay();

      machPlay?.();

      return;
    }

    (window as any).audioRef = audioRef?.current;

    if (audioRef?.current?.paused) {
      handlePlay();
      audioRef?.current?.play();
      return;
    }

    audioRef?.current?.pause();
  }, [
    audioRef,
    audioRef?.current,
    handlePlay,
    isMach,
    isPlaying,
    machPause,
    machPlay,
    setIsPlaying,
  ]);

  useLayoutEffect(() => {
    if (
      appMode === 'test' &&
      audioRef?.current &&
      !audioRef.current.paused &&
      !audioRef.current.ended &&
      audioRef.current.currentTime > 0
    ) {
      setLastSample(audioSource);
      addUsedSample(audioSource);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMode, addUsedSample, audioRef, currentStep, setLastSample]);

  useEffect(() => {
    if (!isMach) {
      return;
    }

    audioRef?.current?.pause();
  }, [isMach, audioRef]);

  const isAzimuthDisabled = appMode === 'test' && guessType === 'elevation';
  const isElevationDisabled =
    appMode === 'test' &&
    ['azimuth', 'left-only', 'right-only', 'bypassed'].includes(guessType);

  return (
    <div
      className={
        disableFixedPosition
          ? classes.dialogNotFixed
          : isInsideView
          ? classes.dialogNarrow
          : classes.dialog
      }
    >
      <div
        className={
          disableFixedPosition ? classes.settingsNotFixed : classes.settings
        }
      >
        {!isInsideView && (
          <div className={classes.settingsColumn}>
            <div className={classes.slider}>
              {!isGuessMade && !shouldHideAzimuth && (
                <CircularSlider
                  withData={isGuessingMode}
                  onChange={(value) => {
                    const prevValue = isGuessingMode ? guessedAzimuth : azimuth;
                    const newValue = value === 1 ? prevValue : value;

                    if (isGuessingMode) {
                      setGuessedAzimuth(newValue);
                      return;
                    }

                    onAzimuthChange(360 - newValue);
                  }}
                  disabled={isAzimuthDisabled}
                />
              )}
            </div>
          </div>
        )}
        <div
          className={
            isInsideView ? classes.settingsColumnFull : classes.settingsColumn
          }
        >
          <div className={classes.select}>
            {isGuessingMode ? (
              <ReferenceButton />
            ) : (
              <AudioSourceSelect sources={audioSources} />
            )}
          </div>
          <div style={{ height: 54 }}>
            <audio
              onPlay={handlePlay}
              onPause={handlePause}
              controls
              src={audioSource}
              ref={audioRef}
              loop
              className={classes.audio}
              style={{
                display: 'none',
              }}
              key='audio-element-guess'
            />
            <Button
              onClick={handlePlayToggle}
              size='md'
              className={classes.button}
              loading={isMachLoading}
            >
              {isMachLoading ? 'Loading' : isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>

          {/* {!isInsideView && (
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
          )} */}
          <Slider
            onChange={onGainChange}
            label='Volume'
            min={0}
            max={100}
            defaultValue={75}
            value={gain}
          />
          {!isInsideView && !shouldHideElevation && (
            <div
              className={classes.elevationSlider}
              onDoubleClick={() => {
                const fn = isGuessingMode
                  ? setGuessedElevation
                  : onElevationChange;

                fn(DEFAULT_ELEVATION);
              }}
            >
              <input
                {...{ type: 'range' }}
                min={MIN_ELEVATION}
                max={MAX_ELEVATION}
                defaultValue={DEFAULT_ELEVATION}
                onChange={(e) => {
                  const fn = isGuessingMode
                    ? setGuessedElevation
                    : onElevationChange;

                  fn(Number(e.target.value));
                }}
                value={isGuessingMode ? guessedElevation : elevation}
                className={classes.elevationInput}
                style={{
                  cursor: isElevationDisabled ? 'not-allowed' : 'pointer',
                }}
                disabled={isElevationDisabled}
                step={isGuessingMode ? 45 : 1}
              />
              <div className={classes.elevation}>
                Elevation:{' '}
                {Math.round(isGuessingMode ? guessedElevation : elevation)}&deg;
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
