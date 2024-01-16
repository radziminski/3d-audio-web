import { Button, createStyles } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect } from 'react';
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
    '@media (max-width: 700px)': {
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      top: '16px',
      gap: '8px',
      padding: '12px',
    },
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
  buttons: {
    position: 'fixed',
    left: '50%',
    bottom: '48px',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
    '@media (max-width: 1300px)': {
      right: '24px',
      top: '64px',
      transform: 'none',
      left: 'unset',
      alignItems: 'flex-end',
      gap: '16px',
      maxHeight: 100,
    },
    '@media (max-width: 700px)': {
      right: '24px',
      top: '130px',
      gap: '8px',
    },
  },
  button: {
    fontSize: '14px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
}));

export const TestModeInfo = () => {
  const { classes } = useStyles();

  const { handleFinishStep } = useTestMode();

  const isGuessMade = useTestStore((state) => state.isGuessMade);
  const setIsGuessMade = useTestStore((state) => state.setIsGuessMade);

  useEffect(() => {
    const timeout = setTimeout(() => setIsGuessMade(false), 50);

    return () => {
      clearTimeout(timeout);
    };
  });

  const onMakeGuess = useCallback(() => {
    setIsGuessMade(true);
    handleFinishStep();
    notifications.show({
      title: 'Guess saved!',
      message: 'Sound direction was changed. ',
      autoClose: 2000,
    });
  }, [handleFinishStep, setIsGuessMade]);

  const onMakeBypassedGuess = useCallback(() => {
    setIsGuessMade(true);
    handleFinishStep(true);
    notifications.show({
      title: 'Guess saved as trap!',
      message: 'Sound direction was changed. ',
      autoClose: 2000,
    });
  }, [handleFinishStep, setIsGuessMade]);

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
      left: 'Azimuth guess',
      right: `${
        Math.floor(azimuthGuess) >= 360 ? 0 : Math.floor(azimuthGuess)
      }°`,
      isBlurred: false,
    },
    {
      left: 'Elevation guess',
      right: `${Math.round(elevationGuess)}°`,
      isBlurred: false,
    },
  ];

  const isMobile = useMediaQuery('(max-width: 1000px)');
  const isSmallMobile = useMediaQuery('(max-width: 700px)');

  return (
    <>
      <div className={classes.wrapper}>
        {!isSmallMobile && <h2 className={classes.title}>Current Step Info</h2>}
        <div className={classes.content}>
          {entries.map(({ left, right, isBlurred }) =>
            isSmallMobile && left === 'Running library' ? null : (
              <div className={classes.entry} key={left}>
                <div className={classes.left}>{left}:</div>
                <div className={isBlurred ? classes.rightBlur : classes.right}>
                  {right}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className={classes.buttons}>
        <div className={classes.button}>
          <Button onClick={onMakeGuess} size={isMobile ? 'md' : 'lg'}>
            Make a guess!
          </Button>
        </div>
        <Button onClick={onMakeBypassedGuess} size='xs'>
          Mark as not 3D sound (trap)
        </Button>
      </div>
    </>
  );
};
