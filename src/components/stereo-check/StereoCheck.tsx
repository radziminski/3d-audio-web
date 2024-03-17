import { Button, createStyles } from '@mantine/core';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Slider } from '../slider/Slider';

const STEPS = 5;

const DEFAULT_GAIN = 0.5;

const useStyles = createStyles(() => ({
  wrapper: {
    maxWidth: 800,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
  },
  paragraph: {
    color: '#333',
    margin: 0,
    fontWeight: 500,
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: '16px  0',
  },
  audio: {
    margin: '24px 0',
  },
  correctWrapper: {
    height: 245,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '32px',
    fontSize: '20px',
    fontWeight: 500,
  },
  hide: {
    display: 'none !important',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '64px',
    '@media (max-width: 800px)': {
      flexDirection: 'column',
      gap: 16,
    },
  },
}));

const rightDirection = { name: 'right', value: 1 } as const;
const leftDirection = { name: 'left', value: -1 } as const;

type Direction = typeof rightDirection | typeof leftDirection;

const getRandomDirection = (bias = 0.5) =>
  Math.random() > bias
    ? ({ name: 'left', value: -1 } as const)
    : ({ name: 'right', value: 1 } as const);

type StereoCheckProps = {
  onSuccess: () => void;
  onError: () => void;
};

export const StereoCheck = ({ onSuccess, onError }: StereoCheckProps) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [directionsList, setDirectionList] = useState<Direction[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const { classes } = useStyles();
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext>();
  const stereoNodeRef = useRef<StereoPannerNode>();
  const gainNodeRef = useRef<GainNode>();

  useLayoutEffect(() => {
    if (audioRef.current && !audioCtxRef.current) {
      // Initialize Web Audio API

      audioCtxRef.current = new AudioContext();

      stereoNodeRef.current = audioCtxRef.current.createStereoPanner();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = DEFAULT_GAIN;

      // Connect the audio node
      const source = audioCtxRef.current.createMediaElementSource(
        audioRef.current
      );

      source.connect(stereoNodeRef.current);
      stereoNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }

    if (stereoNodeRef.current) {
      const direction = getRandomDirection();
      stereoNodeRef.current.pan.value = direction.value;
      setDirectionList([direction]);
    }
  }, []);

  const handleSelectDirection = useCallback(
    (direction: 'left' | 'right') => {
      if (directionsList[step].name === direction && step > STEPS - 1) {
        onSuccess();
        return;
      }

      if (directionsList[step].name !== direction) {
        onError();
        return;
      }

      setIsCorrect(true);
    },
    [directionsList, onError, onSuccess, step]
  );

  const handleGainChange = useCallback((gain: number) => {
    if (gainNodeRef.current) gainNodeRef.current.gain.value = gain / 100;
  }, []);

  const handleNext = useCallback(() => {
    if (stereoNodeRef.current) {
      const sum = directionsList.reduce((acc, a) => acc + a.value, 0);
      const bias = 0.5 - sum / 10;

      const direction = getRandomDirection(bias);
      stereoNodeRef.current.pan.value = direction.value;
      setDirectionList((curr) => [...curr, direction]);

      setTimeout(() => {
        setIsCorrect(false);
        setStep((current) => current + 1);
      }, 400);
    }
  }, [directionsList]);

  return (
    <div className={classes.wrapper}>
      <div className={`${classes.container} ${isCorrect ? classes.hide : ''}`}>
        <audio
          className={classes.audio}
          controls
          src={'/guitarx.mp3'}
          loop
          ref={audioRef}
          style={{ display: 'none' }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          key='audio-element-stereo-check'
        />
        <Button
          size='xl'
          style={{ width: '200px' }}
          onClick={() => {
            if (audioRef.current?.paused) {
              audioRef.current?.play();
              return;
            }

            audioRef.current?.pause();
          }}
        >
          {isPlaying ? 'Pause' : 'Start'}
        </Button>
        <Slider
          onChange={handleGainChange}
          label='Adjust sound volume'
          min={0}
          max={100}
          defaultValue={DEFAULT_GAIN * 100}
          style={{ marginBottom: '24px' }}
        />
      </div>

      {isCorrect ? (
        <div className={classes.correctWrapper}>
          <p>✅ Correct!</p>

          <Button size='lg' onClick={handleNext}>
            Next
          </Button>
        </div>
      ) : (
        <>
          <p className={classes.paragraph}>
            In which ear can you hear the guitar playing?
          </p>
          <div className={classes.buttons}>
            <Button size='lg' onClick={() => handleSelectDirection('left')}>
              LEFT
            </Button>
            <Button size='lg' onClick={() => handleSelectDirection('right')}>
              RIGHT
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
