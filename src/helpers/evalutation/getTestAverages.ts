import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { Guess } from '~/store/settings/useTestStore';
import { getAzimuthError } from './getAzimuthError';
import { getElevationError } from './getElevationError';
import { getTimeDifference } from './getTimeDifference';
import { roundToDecimal } from '../math/roundToDecimal';

export const getTestAverages = (
  guesses: Guess[],
  library?: SupportedLibrary
) => {
  const libraryGuesses = guesses.filter(({ library: guessLibrary }) =>
    library ? guessLibrary === library : true
  );

  const azimuthErrors = libraryGuesses
    .filter((guess) => guess.type === 'azimuth')
    .map(({ trueAzimuth, guessedAzimuth, trueElevation }) =>
      getAzimuthError(trueAzimuth, guessedAzimuth)
    )
    .filter(Boolean) as number[];

  const elevationErrors = libraryGuesses
    .filter((guess) => guess.type === 'elevation')
    .map(({ trueElevation, guessedElevation }) =>
      getElevationError(trueElevation, guessedElevation)
    );

  const averageAzimuthError = roundToDecimal(
    azimuthErrors.reduce((acc, curr) => acc + curr, 0) / azimuthErrors.length
  );

  const averageElevationError = roundToDecimal(
    elevationErrors.reduce((acc, curr) => acc + curr, 0) /
      elevationErrors.length
  );

  const averageStepTime = roundToDecimal(
    libraryGuesses.reduce(
      (acc, { guessStart, guessEnd }) =>
        getTimeDifference(guessStart, guessEnd) + acc,
      0
    ) / libraryGuesses.length
  );

  return { averageAzimuthError, averageElevationError, averageStepTime };
};
