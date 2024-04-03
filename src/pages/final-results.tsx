import { createStyles } from '@mantine/core';
import { Providers } from '~/components/providers/Providers';
import { getTestAverages } from '~/helpers/evalutation/getTestAverages';
import { QualityGuess, Guess } from '../../db/schema';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';
import { Layout } from '~/components/layout/Layout';
import { SUPPORTED_LIBRARIES } from '~/hooks/use-test-mode/useTestMode';
import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { getQualityAverages } from '~/helpers/evalutation/getQualityAverages';
import Link from 'next/link';

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
    gridTemplateColumns: '1fr repeat(9, 2fr)',
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

const LIBRARY_QUALITY_COLUMN_LABELS = [
  'Library',
  'Sound Quality',
  'Spatial Quality',
  'Step Time',
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
];

export default function TestResultPage({
  guesses,
  guessesQuality,
}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  const isClientRender = useClientRender();

  const { classes } = useStyles();

  const users = new Set(guesses.map((guess) => guess.userId));
  const tests = new Set(guesses.map((guess) => guess.testId));

  console.log(users);

  return (
    <Providers>
      {isClientRender && (
        <Layout withScroll>
          <div className={classes.content}>
            <h2 style={{ margin: 0, paddingTop: '32px' }}>
              Test Result - Summary
            </h2>

            <div>Submissions: {tests.size}</div>
            <div>Unique users: {users.size}</div>

            <h3 style={{ margin: 0, marginTop: '16px' }}>Combined results</h3>

            <div className={classes.libraryResultGrid}>
              <div className={classes.libraryResultRow}>
                {LIBRARY_QUALITY_COLUMN_LABELS.map((label) => (
                  <div key={label} className={classes.cellLabel}>
                    {label}
                  </div>
                ))}
              </div>
              {SUPPORTED_LIBRARIES.filter(
                (library) => library !== 'omnitone'
              ).map((library, index) => {
                const { quality, spatialness } = getQualityAverages(
                  guessesQuality,
                  library as SupportedLibrary
                );

                return (
                  <>
                    <div
                      key={`library-guess-${index}`}
                      className={classes.libraryResultRow}
                    >
                      <div className={classes.cell}>{library ?? 'Total'}</div>
                      <div className={classes.cell}>{quality}</div>
                      <div className={classes.cell}>{spatialness}</div>
                      <div className={classes.cell}>-</div>
                    </div>
                  </>
                );
              })}
            </div>

            <div className={classes.libraryResultGrid}>
              <div className={classes.libraryResultRow}>
                {LIBRARY_RESULTS_COLUMN_LABELS.map((label) => (
                  <div key={label} className={classes.cellLabel}>
                    {label}
                  </div>
                ))}
              </div>
              {SUPPORTED_LIBRARIES.filter(
                (library) => library !== 'omnitone'
              ).map((library, index) => {
                const {
                  averageAzimuthError,
                  averageElevationError,
                  averageStepTime,
                } = getTestAverages(
                  [...(guesses as any)],
                  library as SupportedLibrary
                );

                return (
                  <>
                    <div
                      key={`library-guess-${index}`}
                      className={classes.libraryResultRow}
                    >
                      <div className={classes.cell}>{library ?? 'Total'}</div>
                      <div className={classes.cell}>{averageAzimuthError}</div>
                      <div className={classes.cell}>
                        {averageElevationError}
                      </div>
                      <div className={classes.cell}>{averageStepTime} s</div>
                    </div>
                  </>
                );
              })}
            </div>

            {[...tests].map((test) => {
              const localGuesses = guesses.filter(
                (guess) => guess.testId === test
              ) as any;
              const localQuality = guessesQuality.filter(
                (guess) => guess.testId === test
              ) as any;

              return (
                <>
                  <Link href={`/testid-results?testId=${test}`}>
                    <h3>TestId: {test}</h3>
                  </Link>
                  <h5 style={{ margin: 0, textAlign: 'center' }}>
                    UserId: {localQuality[0].userId}
                  </h5>

                  <div className={classes.libraryResultGrid}>
                    <div className={classes.libraryResultRow}>
                      {LIBRARY_QUALITY_COLUMN_LABELS.map((label) => (
                        <div key={label} className={classes.cellLabel}>
                          {label}
                        </div>
                      ))}
                    </div>
                    {SUPPORTED_LIBRARIES.filter(
                      (library) => library !== 'omnitone'
                    ).map((library, index) => {
                      const { quality, spatialness } = getQualityAverages(
                        localQuality,
                        library as SupportedLibrary
                      );

                      return (
                        <>
                          <div
                            key={`library-guess-${index}`}
                            className={classes.libraryResultRow}
                          >
                            <div className={classes.cell}>
                              {library ?? 'Total'}
                            </div>
                            <div className={classes.cell}>{quality}</div>
                            <div className={classes.cell}>{spatialness}</div>
                            <div className={classes.cell}>-</div>
                          </div>
                        </>
                      );
                    })}
                  </div>

                  <div className={classes.libraryResultGrid}>
                    <div className={classes.libraryResultRow}>
                      {LIBRARY_RESULTS_COLUMN_LABELS.map((label) => (
                        <div key={label} className={classes.cellLabel}>
                          {label}
                        </div>
                      ))}
                    </div>
                    {SUPPORTED_LIBRARIES.filter(
                      (library) => library !== 'omnitone'
                    ).map((library, index) => {
                      const {
                        averageAzimuthError,
                        averageElevationError,
                        averageStepTime,
                      } = getTestAverages(
                        [...(localGuesses as any)],
                        library as SupportedLibrary
                      );

                      return (
                        <>
                          <div
                            key={`library-guess-${index}`}
                            className={classes.libraryResultRow}
                          >
                            <div className={classes.cell}>
                              {library ?? 'Total'}
                            </div>
                            <div className={classes.cell}>
                              {averageAzimuthError}
                            </div>
                            <div className={classes.cell}>
                              {averageElevationError}
                            </div>
                            <div className={classes.cell}>
                              {averageStepTime} s
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            })}

            {/* <div className={classes.fullResultsGrid}>
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
                    {['azimuth', 'elevation'].includes(guess.type ?? '')
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
                    {['elevation'].includes(guess.type ?? ' ')
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
                </div>
              ))}
            </div> */}
          </div>
        </Layout>
      )}
    </Providers>
  );
}

const HOST = process.env.NEXT_PUBLIC_HOST ?? 'https://3d-audio-web.vercel.app';

export const getServerSideProps = async () => {
  const guesses = await fetch(`${HOST}/api/guesses`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const guessesQuality = await fetch(`${HOST}/api/guesses-quality`, {
    headers: { 'Content-Type': 'application/json' },
  });

  const guessesData = await guesses.json();
  const guessesQualityData = await guessesQuality.json();

  return {
    props: {
      guesses: guessesData as (Guess & {
        guessStart: number;
        guessEnd: number;
      })[],
      guessesQuality: guessesQualityData as QualityGuess[],
    },
  };
};
