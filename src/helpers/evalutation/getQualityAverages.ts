import { QualityGuess } from '../../../db/schema';
import { roundToDecimal } from '../math/roundToDecimal';

export const getQualityAverages = (
  qualityGuesses: QualityGuess[],
  library: string
) => {
  const guesses = qualityGuesses.filter(
    ({ library: guessLibrary }) => guessLibrary === library
  );

  const quality = roundToDecimal(
    guesses
      .map(({ soundQuality }) => soundQuality)
      .reduce((acc, curr) => acc + curr, 0) / guesses.length
  );

  const spatialness = roundToDecimal(
    guesses
      .map(({ soundSpatialQuality }) => soundSpatialQuality)
      .reduce((acc, curr) => acc + curr, 0) / guesses.length
  );

  return {
    quality,
    spatialness,
  };
};
