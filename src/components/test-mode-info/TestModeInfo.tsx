import { Button, createStyles } from '@mantine/core';
import { useTestMode } from '~/hooks/use-test-mode/useTestMode';
import { useTestStore } from '~/store/settings/useTestStore';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'fixed',
    top: '64px',
    left: '24px',
    zIndex: 100,
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(30px)',
    gap: '16px',
    color: 'white',
    width: 320,
  },
  title: {
    margin: 0,
    padding: 0,
    fontWeight: 700,
    fontSize: '16px',
    textTransform: 'uppercase',
    letterSpacing: '-0.1px',
  },
  entry: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  content: {
    fontSize: '14px',
  },
  left: {
    width: '60%',
    fontWeight: 600,
  },
  right: {
    width: '40%',
  },
  rightBlur: {
    width: '40%',
    filter: 'blur(4px)',
    fontWeight: 700,
    '&:hover': {
      filter: 'blur(0px)',
      fontWeight: 600,
    },
  },
  button: {
    position: 'fixed',
    left: '50%',
    bottom: '48px',
    transform: 'translateX(-50%)',
    fontSize: '14px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
}));

export const TestModeInfo = () => {
  const { classes } = useStyles();

  const { handleFinishStep } = useTestMode();

  const azimuthGuess = useTestStore((state) => state.azimuthGuess);
  const elevationGuess = useTestStore((state) => state.elevationGuess);
  const stepsPerLibrary = useTestStore((state) => state.stepsPerLibrary);
  const currentLibrary = useTestStore((state) => state.currentLibrary);
  const libraryOrder = useTestStore((state) => state.libraryOrder);
  const currentStep = useTestStore((state) => state.currentStep);

  const totalSteps = libraryOrder.length * stepsPerLibrary;

  const entries = [
    {
      left: 'Current step',
      right: `${currentStep + 1}/${totalSteps}`,
      isBlurred: false,
    },
    {
      left: 'Running library',
      right: currentLibrary,
      isBlurred: true,
    },
    {
      left: 'Steps per library',
      right: stepsPerLibrary,
      isBlurred: false,
    },
    {
      left: 'Azimuth guess',
      right: azimuthGuess,
      isBlurred: false,
    },
    {
      left: 'Elevation guess',
      right: elevationGuess,
      isBlurred: false,
    },
  ];

  return (
    <>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Current Step Info</h2>
        <div className={classes.content}>
          {entries.map(({ left, right, isBlurred }) => (
            <div className={classes.entry} key={left}>
              <div className={classes.left}>{left}:</div>
              <div className={isBlurred ? classes.rightBlur : classes.right}>
                {right}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={classes.button}>
        <Button onClick={handleFinishStep} size='lg'>
          Make a guess!
        </Button>
      </div>
    </>
  );
};