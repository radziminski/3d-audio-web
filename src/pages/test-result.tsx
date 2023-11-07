import { Button, Center, createStyles } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { Providers } from '~/components/providers/Providers';
import { Guess, useTestStore } from '~/store/settings/useTestStore';
import { roundToDecimal } from '../helpers/math/roundToDecimal';
import { getAzimuthError } from '~/helpers/evalutation/getAzimuthError';
import { getElevationError } from '~/helpers/evalutation/getElevationError';
import { useRouter } from 'next/router';
import { getTimeDifference } from '~/helpers/evalutation/getTimeDifference';
import { getTestAverages } from '~/helpers/evalutation/getTestAverages';
import { useUserId } from '~/hooks/use-user-id/useUserId';
import { NewGuess } from '../../db/schema';
import { VERSION_SHA } from '~/constants';
import { useOs } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

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
  wrapper: {
    background: 'linear-gradient(to bottom right, #49BCF6 , #49DEB2)',
    width: '100%',
    minHeight: '100vh',
    fontFamily: 'var(--font-poppins)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '64px 32px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    maxWidth: 1200,
    width: '100%',
    gap: '16px',
  },
  libraryResultGrid: {
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
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: '1fr repeat(8, 2fr)',
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
): Promise<void> {
  const apiUrl = '/api/submit-guesses';

  try {
    const guessesDto: NewGuess[] = guesses.map(
      ({ guessStart, guessEnd, ...guess }) => ({
        ...guess,
        trueAzimuth: Math.round(guess.trueAzimuth),
        trueElevation: Math.round(guess.trueElevation),
        guessedAzimuth: Math.round(guess.guessedAzimuth),
        guessedElevation: Math.round(guess.guessedElevation),
        userId,
        testId,
        versionSha: VERSION_SHA ?? 'unknown',
        os,
      })
    );

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guessesDto),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Guesses submitted successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

export default function TestResultPage() {
  const areGuessesSubmitted = useRef(false);
  const router = useRouter();
  const [render, setRender] = useState(false);

  const os = useOs();

  useEffect(() => {
    setRender(true);
  }, []);

  const { classes } = useStyles();

  const guesses = useTestStore((state) => state.guesses);
  const experimentLibraries = useTestStore(
    (state) => state.experimentLibraries
  );

  const userId = useUserId();
  const testId = useTestStore((state) => state.testId);

  useEffect(() => {
    if (userId && testId && !areGuessesSubmitted.current) {
      notifications.show({
        title: '🚨 Submitting test results... ',
        message: 'Please do not leave the site before results are submitted',
        autoClose: 3000,
      });

      submitGuesses(guesses, userId, testId, os).then(() => {
        notifications.show({
          title: 'Test submitted successfully 🎉',
          message: 'You can now safely leave the site',
          autoClose: 10000,
        });
      });
      areGuessesSubmitted.current = true;
    }
  }, [guesses, os, testId, userId]);

  return (
    <Providers>
      {render && (
        <Center className={classes.wrapper}>
          <div className={classes.content}>
            <h2>Test Result</h2>
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
                  <div className={classes.cell}>
                    {roundToDecimal(guess.trueAzimuth)}
                  </div>
                  <div className={classes.cell}>
                    {roundToDecimal(guess.guessedAzimuth)}
                  </div>
                  <div className={classes.cell}>
                    {getAzimuthError(guess.trueAzimuth, guess.guessedAzimuth)}
                  </div>
                  <div className={classes.cell}>
                    {roundToDecimal(guess.trueElevation)}
                  </div>
                  <div className={classes.cell}>
                    {roundToDecimal(guess.guessedElevation)}
                  </div>
                  <div className={classes.cell}>
                    {getElevationError(
                      guess.trueElevation,
                      guess.guessedElevation
                    )}
                  </div>
                  <div className={classes.cell}>
                    {getTimeDifference(guess.guessStart, guess.guessEnd)} s
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => window.location.assign('/test')}>
              Start new test
            </Button>
          </div>
        </Center>
      )}
    </Providers>
  );
}
