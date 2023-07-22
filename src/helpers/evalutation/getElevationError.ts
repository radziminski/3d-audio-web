import { roundToDecimal } from '../math/roundToDecimal';

export const getElevationError = (
  trueElevation: number,
  guessedElevation: number
) => {
  const error = Math.abs(trueElevation - guessedElevation);
  return roundToDecimal(error);
};
