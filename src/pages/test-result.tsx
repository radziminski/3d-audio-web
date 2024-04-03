import { Button, Center, createStyles } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Providers } from '~/components/providers/Providers';
import { Guess, useTestStore } from '~/store/settings/useTestStore';
import { roundToDecimal } from '../helpers/math/roundToDecimal';
import { getAzimuthError } from '~/helpers/evalutation/getAzimuthError';
import { getElevationError } from '~/helpers/evalutation/getElevationError';
import { getTimeDifference } from '~/helpers/evalutation/getTimeDifference';
import { getTestAverages } from '~/helpers/evalutation/getTestAverages';
import { useUserId } from '~/hooks/use-user-id/useUserId';
import { NewGuess } from '../../db/schema';
import { VERSION_SHA } from '~/constants';
import { useOs } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';
import { Layout } from '~/components/layout/Layout';
import { useTestId } from '~/store/settings/useSettingsStore';

const cell = {
  padding: '8px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: 0,
  '&:not(:first-of-type)': {
    borderLeft: 0,
  },
  fontWeight: 500,
  fontSize: '15px',
};

const useStyles = createStyles((theme) => ({
  content: {
    color: '#233',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 1400,
    width: '100%',
    gap: '16px',
  },
  libraryResultGrid: {
    color: 'white',
    width: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    maxWidth: 800,
  },
  libraryResultRow: {
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: '2fr repeat(3, 3fr)',
  },
  fullResultsGrid: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  fullResultsRow: {
    color: 'white',
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: '1fr repeat(10, 2fr)',
  },
  cell: {
    ...cell,
  },
  cellLabel: {
    ...cell,
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase',
    borderTop: '2px solid rgba(255, 255, 255, 0.3)',
  },
}));

const librariesNameMap = {
  '/sample-pinknoise.mp3': 'Pink noise',
  '/sample-speech.mp3': 'Speech',
  '/sample-environmental.mp3': 'Environment',
};

// Step number, library, true az, true el, guessed az, guessed el, az error, el error,

const LIBRARY_RESULTS_COLUMN_LABELS = [
  'Library',
  'Average Azimuth Error',
  'Average Elevation Error',
  'Average Step Time',
];

const FULL_RESULTS_COLUMN_LABELS = [
  'Step',
  'Library',
  'View',
  'Sample',
  'True Azimuth',
  'Guessed Azimuth',
  'Azimuth Error',
  'True Elevation',
  'Guessed Elevation',
  'Elevation Error',
  'Step time',
];

async function submitGuesses(
  guesses: readonly Guess[],
  userId: string,
  testId: string,
  os: string
): Promise<boolean> {
  const apiUrl = '/api/submit-guesses';

  try {
    const guessesDto: NewGuess[] = guesses.map(
      ({ guessStart, guessEnd, ...guess }) => {
        let duration = 0;

        try {
          duration = getTimeDifference(guessStart, guessEnd);
        } catch {}

        return {
          ...guess,
          trueAzimuth: Math.round(guess.trueAzimuth),
          trueElevation: Math.round(guess.trueElevation),
          guessedAzimuth: Math.round(guess.guessedAzimuth),
          guessedElevation: Math.round(guess.guessedElevation),
          userId,
          testId,
          versionSha: VERSION_SHA ?? 'unknown',
          os,
          duration,
        };
      }
    );

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guessesDto),
    });

    if (!response.ok) {
      const error = await response.json();

      if (error.message === 'Test already submitted') {
        return true;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Guesses submitted successfully!');

    return true;
  } catch (error) {
    console.error('Error:', error);

    return false;
  }
}

export default function TestResultPage() {
  const areGuessesSubmitted = useRef(false);
  const isClientRender = useClientRender();
  const [isSubmitError, setIsSubmitError] = useState(false);

  const os = useOs({ getValueInEffect: true });

  const { classes } = useStyles();

  const guesses = useTestStore((state) => state.guesses);
  const experimentLibraries = useTestStore(
    (state) => state.experimentLibraries
  );

  const userId = useUserId();
  const testId = useTestId();

  const handleSubmit = useCallback(() => {
    if (!userId || !testId) return;

    submitGuesses(guesses, userId, testId, os).then((isSuccess) => {
      if (!isSuccess) {
        notifications.show({
          title: '🚨 Test results submission failed',
          message: 'Please try again later',
          autoClose: 10000,
        });

        setIsSubmitError(true);

        return;
      }

      notifications.show({
        title: 'Test submitted successfully 🎉',
        message: 'You can now safely leave the site',
        autoClose: 10000,
      });
      setIsSubmitError(false);
    });
    areGuessesSubmitted.current = true;
  }, [guesses, os, testId, userId]);

  useEffect(() => {
    if (userId && testId && !areGuessesSubmitted.current) {
      notifications.show({
        title: '🚨 Submitting test results... ',
        message: 'Please do not leave the site before results are submitted',
        autoClose: 3000,
      });

      handleSubmit();
    }
  }, [guesses, handleSubmit, os, testId, userId]);

  useEffect(() => {
    // @ts-expect-error
    window.controls?.pause?.();
  }, []);

  return (
    <Providers>
      {isClientRender && (
        <Layout withScroll>
          <div className={classes.content}>
            <h2 style={{ margin: 0, paddingTop: '32px' }}>Test Result</h2>
            <p>
              Thank You for participating in this 3D Sound Test! Your
              involvement has been invaluable in helping me explore the
              potential of different 3D sound technologies. I truly appreciate
              the time you spent and the feedback you provided. Your insights
              are crucial in shaping the future of immersive audio experiences.
              Feel free to share your experience with friends and family! 🙌
            </p>
            {isSubmitError && (
              <div
                style={{
                  maxWidth: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <h3>
                  There was a problem with submitting results. Please make sure
                  you have internet connection and try again:
                </h3>
                <Button onClick={handleSubmit}>🚀 Submit results</Button>
              </div>
            )}
            <p>
              Your testId: {testId} <br />
              Your userId: {userId} <br />
            </p>
            <div className={classes.libraryResultGrid}>
              <div className={classes.libraryResultRow}>
                {LIBRARY_RESULTS_COLUMN_LABELS.map((label) => (
                  <div key={label} className={classes.cellLabel}>
                    {label}
                  </div>
                ))}
              </div>
              {[undefined, ...experimentLibraries].map((library, index) => {
                const {
                  averageAzimuthError,
                  averageElevationError,
                  averageStepTime,
                } = getTestAverages([...guesses], library);

                return (
                  <div
                    key={`library-guess-${index}`}
                    className={classes.libraryResultRow}
                  >
                    <div className={classes.cell}>{library ?? 'Total'}</div>
                    <div className={classes.cell}>{averageAzimuthError}</div>
                    <div className={classes.cell}>{averageElevationError}</div>
                    <div className={classes.cell}>{averageStepTime} s</div>
                  </div>
                );
              })}
            </div>
            <div className={classes.fullResultsGrid}>
              <div className={classes.fullResultsRow}>
                {FULL_RESULTS_COLUMN_LABELS.map((label) => (
                  <div key={label} className={classes.cellLabel}>
                    {label}
                  </div>
                ))}
              </div>
              {guesses.map((guess, index) => (
                <div key={`guess-${index}`} className={classes.fullResultsRow}>
                  <div className={classes.cell}>{index + 1}</div>
                  <div className={classes.cell}>{guess.library}</div>
                  <div className={classes.cell}>{guess.view}</div>
                  <div className={classes.cell}>
                    {
                      librariesNameMap[
                        (guess.sample as keyof typeof librariesNameMap) ??
                          '/sample-pinknoise.mp3'
                      ]
                    }
                  </div>
                  <div className={classes.cell}>
                    {['azimuth', 'elevation'].includes(guess.type)
                      ? roundToDecimal(guess.trueAzimuth)
                      : '-'}
                  </div>
                  <div className={classes.cell}>
                    {guess.type === 'azimuth'
                      ? roundToDecimal(guess.guessedAzimuth)
                      : '-'}
                  </div>
                  <div className={classes.cell}>
                    {guess.type === 'azimuth'
                      ? getAzimuthError(guess.trueAzimuth, guess.guessedAzimuth)
                      : '-'}
                  </div>
                  <div className={classes.cell}>
                    {['elevation'].includes(guess.type)
                      ? roundToDecimal(guess.trueElevation)
                      : '-'}
                  </div>
                  <div className={classes.cell}>
                    {guess.type === 'elevation'
                      ? roundToDecimal(guess.guessedElevation)
                      : '-'}
                  </div>
                  <div className={classes.cell}>
                    {guess.type === 'elevation'
                      ? getElevationError(
                          guess.trueElevation,
                          guess.guessedElevation
                        )
                      : '-'}
                  </div>
                  <div className={classes.cell}>
                    {getTimeDifference(guess.guessStart, guess.guessEnd)} s
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => window.location.assign('/')}>
              Start new test
            </Button>
          </div>
        </Layout>
      )}
    </Providers>
  );
}
