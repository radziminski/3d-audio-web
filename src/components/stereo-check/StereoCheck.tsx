import { Button, createStyles } from '@mantine/core';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const STEPS = 6;

const useStyles = createStyles(() => ({
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
    display: 'none',
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
  const [directionsList, setDirectionList] = useState<Direction[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const { classes } = useStyles();
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext>();
  const stereoNodeRef = useRef<StereoPannerNode>();

  useLayoutEffect(() => {
    if (audioRef.current && !audioCtxRef.current) {
      // Initialize Web Audio API

      audioCtxRef.current = new AudioContext();

      stereoNodeRef.current = audioCtxRef.current.createStereoPanner();

      // Connect the audio node
      const source = audioCtxRef.current.createMediaElementSource(
        audioRef.current
      );

      source.connect(stereoNodeRef.current);
      stereoNodeRef.current.connect(audioCtxRef.current.destination);
    }

    if (stereoNodeRef.current) {
      const direction = getRandomDirection();
      stereoNodeRef.current.pan.value = direction.value;
      setDirectionList([direction]);
    }
  }, []);

  const handleSelectDirection = useCallback(
    (direction: 'left' | 'right') => {
      if (step > STEPS - 1) {
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
    <>
      <audio
        className={`${classes.audio} ${isCorrect ? classes.hide : ''}`}
        controls
        src={'/guitar.mp3'}
        loop
        ref={audioRef}
      />
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
    </>
  );
};
